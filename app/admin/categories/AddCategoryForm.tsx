"use client";

import { addCategory } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { toast } from "sonner";
import { useRef } from "react";

export default function AddCategoryForm() {
    const formRef = useRef<HTMLFormElement>(null);

    async function handleAction(formData: FormData) {
        const result = await addCategory(formData);
        if (result && result.success) {
            toast.success("Category added successfully");
            formRef.current?.reset();
        } else if (result) {
            toast.error(result.error || "Failed to add category");
        }
    }

    return (
        <div className="bg-background border border-border p-6 rounded-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Add New Category</h2>
            <form ref={formRef} action={handleAction} className="flex flex-col sm:flex-row gap-4">
                <input name="name" required placeholder="Category Name" className="flex-1 bg-secondary border border-border px-4 py-2" />
                <div className="flex-1 flex gap-2 items-center">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap">Image:</label>
                    <input type="file" name="image" accept="image/*" className="w-full bg-secondary border border-border px-2 py-1 text-xs" />
                </div>
                <SubmitButton>Add</SubmitButton>
            </form>
        </div>
    );
}
