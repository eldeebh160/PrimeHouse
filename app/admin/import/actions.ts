"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import ExcelJS from 'exceljs';
import path from "path";
import { writeFile, mkdir } from "fs/promises";

// Helper to clean filename for matching (only removes extension and trims)
function getBaseMatchName(name: string) {
    return name.toLowerCase()
        .replace(/\.[^/.]+$/, "") // remove extension
        .trim();
}

function findMatchedImages(productName: string, nameToImagesMap: Map<string, string[]>) {
    const lowerName = productName.toLowerCase().trim();
    if (!lowerName) return [];

    const matched: string[] = [];
    for (const [imgName, urls] of Array.from(nameToImagesMap.entries())) {
        // Match if the product name exactly is part of the image name
        if (imgName.includes(lowerName)) {
            matched.push(...urls);
        }
    }
    return matched;
}

export async function importProductsFromExcel(formData: FormData) {
    const file = formData.get("file") as File;
    const extraImages = formData.getAll("extraImages") as File[];

    if ((!file || file.size === 0) && extraImages.length === 0) {
        return { success: false, error: "No file or images provided" };
    }

    try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // 1. Process Extra Uploaded Images (Grouped by base name)
        const nameToImagesMap = new Map<string, string[]>();
        for (const imgFile of extraImages) {
            if (imgFile.size > 0) {
                const ext = path.extname(imgFile.name).slice(1) || 'png';
                const baseMatchName = getBaseMatchName(imgFile.name);
                const filename = `bulk-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
                const filePath = path.join(uploadDir, filename);
                const buffer = await imgFile.arrayBuffer();
                await writeFile(filePath, Buffer.from(buffer));

                const url = `/uploads/${filename}`;
                if (!nameToImagesMap.has(baseMatchName)) {
                    nameToImagesMap.set(baseMatchName, []);
                }
                nameToImagesMap.get(baseMatchName)!.push(url);
            }
        }

        let processedCount = 0;
        const processedProductNames = new Set<string>();

        // 2. Process Excel if provided
        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
            const worksheet = workbook.getWorksheet(1);

            if (worksheet) {
                const categoriesResult = await db.execute('SELECT id, name FROM categories');
                const categories = categoriesResult.rows as any[];
                let categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

                const imagesByRow = new Map<number, string>();
                const excelImages = worksheet.getImages();

                for (const img of excelImages) {
                    const image = workbook.getImage(Number(img.imageId));
                    const ext = image.extension || 'png';
                    const filename = `excel-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
                    const filePath = path.join(uploadDir, filename);
                    if (image.buffer) {
                        await writeFile(filePath, Buffer.from(image.buffer as unknown as Uint8Array));
                        imagesByRow.set(img.range.tl.row + 1, `/uploads/${filename}`);
                    }
                }

                const batchStatements: { sql: string, args: any[] }[] = [];
                const checkExists = async (name: string) => {
                    const res = await db.execute({ sql: `SELECT id, image_url FROM products WHERE name = ? LIMIT 1`, args: [name] });
                    return res.rows[0];
                };

                for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                    const row = worksheet.getRow(rowNumber);
                    if (!row.hasValues) continue;

                    // Get cell values safely
                    const getVal = (idx: number) => {
                        const val = row.getCell(idx).value;
                        if (val && typeof val === 'object' && 'result' in val) return val.result?.toString() || "";
                        return val?.toString() || "";
                    };

                    const name = getVal(1).trim() || "Untitled Product";
                    const price = Math.round(parseFloat(getVal(2).replace(/[^0-9.]/g, '') || "0"));
                    const salePriceVal = getVal(3);
                    const salePrice = salePriceVal ? Math.round(parseFloat(salePriceVal.replace(/[^0-9.]/g, '') || "0")) : null;
                    const categoryNameRaw = getVal(4).trim();
                    const description = getVal(5).trim() || "";
                    const imageUrlFromCell = getVal(6).trim() || null;
                    const features = "";

                    // Handle Category (We do this synchronously since we might need the ID for the next steps)
                    let categoryId = null;
                    if (categoryNameRaw) {
                        const lowCat = categoryNameRaw.toLowerCase();
                        if (categoryMap.has(lowCat)) {
                            categoryId = categoryMap.get(lowCat);
                        } else {
                            // Create new category
                            const slug = categoryNameRaw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                            try {
                                const info = await db.execute({ sql: 'INSERT INTO categories (name, slug) VALUES (?, ?)', args: [categoryNameRaw, slug] });
                                categoryId = Number(info.lastInsertRowid);
                                categoryMap.set(lowCat, categoryId);
                            } catch (catErr) {
                                // Fallback
                                const res = await db.execute({ sql: 'SELECT id FROM categories WHERE name = ?', args: [categoryNameRaw] });
                                categoryId = (res.rows[0] as any)?.id || null;
                            }
                        }
                    }

                    const matchedImages = findMatchedImages(name, nameToImagesMap);
                    const excelImg = imagesByRow.get(rowNumber);
                    const mainImage = matchedImages[0] || excelImg || imageUrlFromCell;

                    const existing = (await checkExists(name)) as any;

                    let productId;
                    if (existing) {
                        productId = existing.id;
                        batchStatements.push({
                            sql: `UPDATE products SET category_id = ?, price = ?, sale_price = ?, description = ?, features = ?, image_url = ? WHERE id = ?`,
                            args: [categoryId, price, salePrice, description, features, mainImage || existing.image_url, productId]
                        });
                        batchStatements.push({ sql: 'DELETE FROM product_images WHERE product_id = ?', args: [productId] });
                    } else {
                        const info = await db.execute({
                            sql: `INSERT INTO products (name, category_id, price, sale_price, description, features, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            args: [name, categoryId, price, salePrice, description, features, mainImage]
                        });
                        productId = Number(info.lastInsertRowid);
                    }

                    // Populate all images
                    const allImages = new Set<string>();
                    if (mainImage) allImages.add(mainImage);
                    matchedImages.forEach(img => allImages.add(img));
                    if (excelImg) allImages.add(excelImg);
                    if (imageUrlFromCell) allImages.add(imageUrlFromCell);

                    for (const url of Array.from(allImages)) {
                        batchStatements.push({ sql: 'INSERT INTO product_images (product_id, url) VALUES (?, ?)', args: [productId, url] });
                    }

                    const lowerName = name.toLowerCase().trim();
                    for (const key of Array.from(nameToImagesMap.keys())) {
                        if (key.includes(lowerName)) {
                            processedProductNames.add(key);
                        }
                    }
                    processedCount++;
                }

                if (batchStatements.length > 0) {
                    await db.batch(batchStatements, "write");
                }
            }
        }

        // 3. Process remaining images
        const remainingImages = new Map<string, string[]>();
        for (const [key, urls] of Array.from(nameToImagesMap.entries())) {
            if (!processedProductNames.has(key)) {
                remainingImages.set(key, urls);
            }
        }

        if (remainingImages.size > 0) {
            const findAllProducts = await db.execute(`SELECT id, name, image_url FROM products`);
            const finalStatements: { sql: string, args: any[] }[] = [];

            for (const product of findAllProducts.rows as any[]) {
                const matched = findMatchedImages(product.name, remainingImages);
                if (matched.length > 0) {
                    finalStatements.push({ sql: 'DELETE FROM product_images WHERE product_id = ?', args: [product.id] });
                    for (const url of matched) {
                        finalStatements.push({ sql: 'INSERT INTO product_images (product_id, url) VALUES (?, ?)', args: [product.id, url] });
                    }
                    if (!product.image_url) {
                        finalStatements.push({ sql: 'UPDATE products SET image_url = ? WHERE id = ?', args: [matched[0], product.id] });
                    }
                    processedCount++;
                }
            }
            if (finalStatements.length > 0) {
                await db.batch(finalStatements, "write");
            }
        }

        revalidatePath("/shop");
        revalidatePath("/admin");
        revalidatePath("/admin/products");

        return { success: true, count: processedCount };
    } catch (e) {
        console.error("Import failed:", e);
        return { success: false, error: "Failed to process import. Check format and try again." };
    }
}
