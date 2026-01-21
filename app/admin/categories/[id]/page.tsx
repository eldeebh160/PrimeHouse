import db from "@/lib/db";
import { notFound } from "next/navigation";
import EditCategoryForm from "./EditCategoryForm";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const result = await db.execute({ sql: 'SELECT * FROM categories WHERE id = ?', args: [params.id] });
    const category = result.rows[0] as any;

    if (!category) notFound();

    return (
        <div className="max-w-xl space-y-8">
            <h1 className="font-heading text-3xl font-bold">Edit Category</h1>
            <EditCategoryForm category={category} />
        </div>
    );
}
