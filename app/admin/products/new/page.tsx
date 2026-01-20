import db from "@/lib/db";
import NewProductForm from "./form";

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
    const result = await db.execute('SELECT * FROM categories ORDER BY name');
    const categories = result.rows as any[];

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="font-heading text-3xl font-bold">New Product</h1>

            <div className="bg-background border border-border p-8 rounded-sm">
                <NewProductForm categories={categories} />
            </div>
        </div>
    );
}
