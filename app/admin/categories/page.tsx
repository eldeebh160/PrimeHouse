import db from "@/lib/db";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import AddCategoryForm from "./AddCategoryForm";
import DeleteCategoryButton from "./DeleteCategoryButton";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const result = await db.execute('SELECT * FROM categories ORDER BY name');
    const categories = result.rows as any[];

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="font-heading text-3xl font-bold">Categories</h1>

            <AddCategoryForm />

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
                                        <DeleteCategoryButton id={cat.id} />
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

