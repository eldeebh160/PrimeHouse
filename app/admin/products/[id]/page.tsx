import db from "@/lib/db";
import { notFound } from "next/navigation";
import EditProductForm from "./form"; // Client component

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const productResult = await db.execute({ sql: 'SELECT * FROM products WHERE id = ?', args: [params.id] });
    const product = productResult.rows[0];

    if (!product) notFound();

    const variantsResult = await db.execute({ sql: 'SELECT * FROM product_variants WHERE product_id = ?', args: [params.id] });
    const variants = variantsResult.rows as any[];

    const categoriesResult = await db.execute(`
        SELECT c1.*, c2.name as parent_name 
        FROM categories c1 
        LEFT JOIN categories c2 ON c1.parent_id = c2.id 
        ORDER BY COALESCE(c2.name, c1.name), c1.name
    `);
    const categories = categoriesResult.rows as any[];

    const imagesResult = await db.execute({ sql: 'SELECT * FROM product_images WHERE product_id = ?', args: [params.id] });
    const images = imagesResult.rows as any[];

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="font-heading text-3xl font-bold">Edit Product</h1>
            <div className="bg-background border border-border p-8 rounded-sm">
                <EditProductForm product={product} initialVariants={variants} categories={categories} initialImages={images} />
            </div>
        </div>
    );
}
