"use client";

import { updateCategory } from "../actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditCategoryForm({ category, categories }: { category: any, categories: any[] }) {
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const result = await updateCategory(formData);
        if (result.success) {
            toast.success("Category updated successfully");
            router.push("/admin/categories");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update category");
        }
    }

    return (
        <div className="bg-background border border-border p-6 rounded-sm">
            <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="id" value={category.id} />
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Category Name</label>
                    <input name="name" defaultValue={category.name} required className="w-full bg-secondary border border-border px-4 py-2" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Parent Category</label>
                    <select name="parent_id" defaultValue={category.parent_id || ""} className="w-full bg-secondary border border-border px-4 py-2 text-sm">
                        <option value="">None (Top Level)</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
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
                    <SubmitButton className="bg-black text-white px-6 py-2 uppercase font-bold text-xs tracking-widest hover:bg-gray-800 transition-colors">
                        Update Category
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
