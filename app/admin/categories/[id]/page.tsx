import db from "@/lib/db";
import { notFound } from "next/navigation";
import { updateCategory } from "../actions";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const result = await db.execute({ sql: 'SELECT * FROM categories WHERE id = ?', args: [params.id] });
    const category = result.rows[0] as any;

    if (!category) notFound();

    return (
        <div className="max-w-xl space-y-8">
            <h1 className="font-heading text-3xl font-bold">Edit Category</h1>

            <div className="bg-background border border-border p-6 rounded-sm">
                <form action={updateCategory} className="space-y-4">
                    <input type="hidden" name="id" value={category.id} />
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-muted-foreground">Category Name</label>
                        <input name="name" defaultValue={category.name} required className="w-full bg-secondary border border-border px-4 py-2" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs uppercase font-bold text-muted-foreground block">Category Image</label>
                        {category.image_url && (
                            <div className="relative w-32 h-32 bg-secondary border border-border overflow-hidden rounded-sm mb-2">
                                <img src={category.image_url} alt={category.name} className="object-cover w-full h-full" />
                            </div>
                        )}
                        <input type="file" name="image" accept="image/*" className="w-full bg-secondary border border-border px-4 py-2 text-sm" />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="bg-black text-white px-6 py-2 uppercase font-bold text-xs tracking-widest hover:bg-gray-800 transition-colors">
                            Update Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
