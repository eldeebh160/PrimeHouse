"use client";

import { deleteCategory } from "./actions";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteCategoryButton({ id }: { id: number }) {
    async function handleAction() {
        if (!confirm("Are you sure? This will delete the category permanently.")) return;

        const formData = new FormData();
        formData.append("id", id.toString());

        const result = await deleteCategory(formData);
        if (result && result.success) {
            toast.success("Category deleted");
        } else if (result) {
            toast.error(result.error || "Failed to delete category");
        }
    }

    return (
        <button
            onClick={handleAction}
            className="p-2 hover:text-red-500 text-muted-foreground transition-colors"
            title="Delete Category"
        >
            <Trash2 size={16} />
        </button>
    );
}
