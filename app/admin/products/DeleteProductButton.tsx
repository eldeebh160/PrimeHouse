"use client";

import { deleteProduct } from "./actions";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }: { id: number }) {
    const router = useRouter();

    async function handleAction() {
        if (!confirm("Are you sure? This will delete the product permanently.")) return;

        const formData = new FormData();
        formData.append("id", id.toString());

        const result = await deleteProduct(formData);
        if (result && result.success) {
            toast.success("Product deleted");
            router.refresh();
        } else if (result) {
            toast.error(result.error || "Failed to delete product");
        }
    }

    return (
        <button
            onClick={handleAction}
            className="p-2 hover:text-red-500 text-muted-foreground transition-colors"
            title="Delete Product"
        >
            <Trash2 size={16} />
        </button>
    );
}
