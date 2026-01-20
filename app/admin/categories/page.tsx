import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { addCategory, deleteCategory } from "./actions";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const result = await db.execute('SELECT * FROM categories ORDER BY name');
    const categories = result.rows as any[];

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="font-heading text-3xl font-bold">Categories</h1>

            {/* Add New */}
            <div className="bg-background border border-border p-6 rounded-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Add New Category</h2>
                <form action={addCategory} className="flex flex-col sm:flex-row gap-4">
                    <input name="name" required placeholder="Category Name" className="flex-1 bg-secondary border border-border px-4 py-2" />
                    <div className="flex-1 flex gap-2 items-center">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap">Image:</label>
                        <input type="file" name="image" accept="image/*" className="w-full bg-secondary border border-border px-2 py-1 text-xs" />
                    </div>
                    <button type="submit" className="bg-black text-white px-6 py-2 uppercase font-bold text-xs tracking-widest">
                        Add
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-background border border-border rounded-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary text-xs uppercase tracking-widest font-bold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Slug</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="px-6 py-4 font-mono text-muted-foreground">#{cat.id}</td>
                                <td className="px-6 py-4">
                                    {cat.image_url ? (
                                        <div className="relative w-10 h-10 bg-secondary rounded-sm overflow-hidden border border-border">
                                            <img src={cat.image_url} alt={cat.name} className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 bg-secondary rounded-sm border border-border flex items-center justify-center text-[8px] text-muted-foreground uppercase">
                                            No Img
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-bold">{cat.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{cat.slug}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/categories/${cat.id}`} className="p-2 hover:text-black text-muted-foreground transition-colors">
                                            <Pencil size={16} />
                                        </Link>
                                        <form action={deleteCategory} className="inline-block">
                                            <input type="hidden" name="id" value={cat.id} />
                                            <button type="submit" className="p-2 hover:text-red-500 text-muted-foreground transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

