"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveImage(file: File) {
    if (!file || file.size === 0) return null;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));

    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);
    return `/uploads/${filename}`;
}

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const sale_price = formData.get("sale_price") ? parseFloat(formData.get("sale_price") as string) : null;
    const category_id = formData.get("category_id") ? parseInt(formData.get("category_id") as string) : null;
    const description = formData.get("description") as string;
    const features = formData.get("features") as string;
    const variantsJson = formData.get("variants_json") as string;
    const is_featured = formData.get("is_featured") === "on" ? 1 : 0;

    // Handle Images
    const imageFiles = formData.getAll("images") as File[];
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
        const url = await saveImage(file);
        if (url) imageUrls.push(url);
    }

    const mainImage = imageUrls.length > 0 ? imageUrls[0] : null;

    // Insert Main Product
    const info = await db.execute({
        sql: `INSERT INTO products (name, price, sale_price, category_id, description, features, image_url, is_featured) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
            name as string,
            price as number,
            sale_price as number | null,
            category_id as number | null,
            description as string,
            features as string,
            mainImage as string | null,
            is_featured as number
        ]
    });
    const productId = Number(info.lastInsertRowid);

    // Handle Extra Images
    if (imageUrls.length > 0) {
        const imageStatements = imageUrls.map(url => ({
            sql: 'INSERT INTO product_images (product_id, url) VALUES (?, ?)',
            args: [productId, url]
        }));
        await db.batch(imageStatements, "write");
    }

    // Handle Variants
    if (variantsJson) {
        const variants = JSON.parse(variantsJson);
        const variantStatements = variants
            .filter((v: any) => v.name && v.value)
            .map((v: any) => ({
                sql: 'INSERT INTO product_variants (product_id, name, value, price) VALUES (?, ?, ?, ?)',
                args: [productId, v.name, v.value, v.price ? parseFloat(v.price.toString()) : null]
            }));

        if (variantStatements.length > 0) {
            await db.batch(variantStatements, "write");
        }
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
    const id = formData.get("id");
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const sale_price = formData.get("sale_price") ? parseFloat(formData.get("sale_price") as string) : null;
    const category_id = formData.get("category_id") ? parseInt(formData.get("category_id") as string) : null;
    const description = formData.get("description") as string;
    const features = formData.get("features") as string;
    const variantsJson = formData.get("variants_json") as string;
    const is_featured = formData.get("is_featured") === "on" ? 1 : 0;
    const imageOrderJson = formData.get("image_order") as string;

    // Handle New Images
    const imageFiles = formData.getAll("images") as File[];
    const newImageUrls: string[] = [];
    for (const file of imageFiles) {
        const url = await saveImage(file);
        if (url) newImageUrls.push(url);
    }

    // Update product info
    await db.execute({
        sql: `UPDATE products 
              SET name = ?, price = ?, sale_price = ?, category_id = ?, description = ?, features = ?, is_featured = ?
              WHERE id = ?`,
        args: [
            name as string,
            price as number,
            sale_price as number | null,
            category_id as number | null,
            description as string,
            features as string,
            is_featured as number,
            id as string
        ]
    });

    // Sync Images (Reorder & Remove)
    // 1. Add new images to DB first (so they have IDs if we needed them, but we primarily key by URL or just re-insert)
    // Actually, simpler strategy:
    // The client sends us a list of ALL active image URLs in order.
    // This list includes existing images AND the placeholders for new images. 
    // Wait, the client doesn't know the URL of existing new images yet.
    // Strategy:
    // Client sends `image_order` which mimics the UI state. 
    // Existing images have real URLs. New images might need a temporary ID or we just append them?
    // Let's refine the client-side plan:
    // The Client will upload new images. The Server saves them.
    // The Client ALSO sends `image_order`. containing a list of { url: string } or { newImageIndex: number }.
    // Actually, simpler:
    // 1. Save all new images -> get their URLs.
    // 2. The client should send `active_images` which is a list of existing URLs that should be KEPT.
    // 3. New images are automatically appended to the end OR we need a way to interleave.

    // Better Strategy for Interleaving:
    // The client sends `image_layout` JSON: [ { type: 'existing', url: '...' }, { type: 'new', index: 0 }, ... ]
    // Then we construct the final list of URLs.

    let finalImageUrls: string[] = [];

    if (imageOrderJson) {
        const layout = JSON.parse(imageOrderJson);
        for (const item of layout) {
            if (item.type === 'existing') {
                finalImageUrls.push(item.url);
            } else if (item.type === 'new' && newImageUrls[item.index] !== undefined) {
                finalImageUrls.push(newImageUrls[item.index]);
            }
        }
    } else {
        // Fallback: Keep existing (lookup) + Append New
        const idStr = String(id);
        const existingResult = await db.execute({ sql: 'SELECT url FROM product_images WHERE product_id = ? ORDER BY display_order ASC', args: [idStr] });
        const existing = existingResult.rows as any[];
        finalImageUrls = [...existing.map(e => e.url), ...newImageUrls];
    }

    // Sync Images (Reorder & Remove)
    const mainImage = finalImageUrls.length > 0 ? finalImageUrls[0] : null;
    const idValue = id as string;

    const syncStatements = [
        { sql: 'DELETE FROM product_images WHERE product_id = ?', args: [idValue] },
        ...finalImageUrls.map((url, index) => ({
            sql: 'INSERT INTO product_images (product_id, url, display_order) VALUES (?, ?, ?)',
            args: [idValue, url, index]
        })),
        { sql: 'UPDATE products SET image_url = ? WHERE id = ?', args: [mainImage, idValue] }
    ];

    await db.batch(syncStatements, "write");

    // Update Variants (Simple strategy: delete all and re-add)
    const variantStatements = [
        { sql: 'DELETE FROM product_variants WHERE product_id = ?', args: [idValue] }
    ];

    if (variantsJson) {
        const variants = JSON.parse(variantsJson);
        variantStatements.push(...variants
            .filter((v: any) => v.name && v.value)
            .map((v: any) => ({
                sql: 'INSERT INTO product_variants (product_id, name, value, price) VALUES (?, ?, ?, ?)',
                args: [idValue, v.name, v.value, v.price ? parseFloat(v.price.toString()) : null]
            })));
    }

    await db.batch(variantStatements, "write");

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
    const id = formData.get("id") as string;
    await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
}

export async function bulkImportProducts(data: string) {
    const lines = data.split('\n').filter(line => line.trim() !== '');

    // Get all categories to match by name
    const categoriesResult = await db.execute('SELECT id, name FROM categories');
    const categories = categoriesResult.rows as any[];
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

    const statements: { sql: string, args: any[] }[] = [];

    for (const row of lines) {
        const columns = row.split('\t');
        if (columns.length < 3) continue; // Skip invalid rows (Name, Category, Price are min)

        const name = columns[0]?.trim();
        const categoryName = columns[1]?.trim().toLowerCase();
        const price = parseFloat(columns[2]?.replace(/[^0-9.]/g, '') || "0");
        const salePrice = columns[3] ? parseFloat(columns[3].replace(/[^0-9.]/g, '') || "0") : null;
        const description = columns[4]?.trim() || "";
        const features = columns[5]?.trim() || "";
        const imageUrl = columns[6]?.trim() || null;

        const categoryId = categoryMap.get(categoryName) || null;

        statements.push({
            sql: `INSERT INTO products (name, category_id, price, sale_price, description, features, image_url) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [name, categoryId, price, salePrice, description, features, imageUrl]
        });
    }

    try {
        await db.batch(statements, "write");
        revalidatePath("/admin/products");
        revalidatePath("/shop");
        return { success: true, count: lines.length };
    } catch (error) {
        console.error("Bulk import failed:", error);
        throw new Error("Failed to import products. Please check your data format.");
    }
}
import ExcelJS from 'exceljs';

export async function importProductsFromExcel(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) throw new Error("No file uploaded");

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) throw new Error("Worksheet not found");

    // Get all categories to match by name
    const categoriesResult = await db.execute('SELECT id, name FROM categories');
    const categories = categoriesResult.rows as any[];
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

    const statements: { sql: string, args: any[] }[] = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const name = row.getCell(1).value?.toString()?.trim();
        const categoryName = row.getCell(2).value?.toString()?.trim().toLowerCase();
        const priceValue = row.getCell(3).value?.toString() || "0";
        const price = parseFloat(priceValue.replace(/[^0-9.]/g, '') || "0");

        const salePriceValue = row.getCell(4).value?.toString();
        const salePrice = salePriceValue ? parseFloat(salePriceValue.replace(/[^0-9.]/g, '') || "0") : null;

        const description = row.getCell(5).value?.toString()?.trim() || "";
        const features = row.getCell(6).value?.toString()?.trim() || "";
        const imageUrl = null;

        if (name && price) {
            const categoryId = categoryName ? (categoryMap.get(categoryName) || null) : null;
            statements.push({
                sql: `INSERT INTO products (name, category_id, price, sale_price, description, features, image_url) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [name, categoryId, price, salePrice, description, features, imageUrl]
            });
        }
    });

    try {
        if (statements.length > 0) {
            await db.batch(statements, "write");
        }
        revalidatePath("/admin/products");
        revalidatePath("/shop");
        return { success: true, count: statements.length };
    } catch (error) {
        console.error("Excel import failed:", error);
        throw new Error("Failed to import Excel file. Ensure it follows the required column order.");
    }
}
