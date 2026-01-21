"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { saveImage } from "../products/actions";

export async function addCategory(formData: FormData) {
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/ /g, '-');
    const imageFile = formData.get("image") as File;
    const imageUrl = await saveImage(imageFile);

    try {
        await db.execute({ sql: 'INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)', args: [name, slug, imageUrl] });
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message || "Failed to add category." };
    }
}

export async function updateCategory(formData: FormData) {
    const id = formData.get("id");
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/ /g, '-');
    const imageFile = formData.get("image") as File;

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveImage(imageFile);
    }

    try {
        if (imageUrl) {
            await db.execute({ sql: 'UPDATE categories SET name = ?, slug = ?, image_url = ? WHERE id = ?', args: [name, slug, imageUrl, id as string] });
        } else {
            await db.execute({ sql: 'UPDATE categories SET name = ?, slug = ? WHERE id = ?', args: [name, slug, id as string] });
        }
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message || "Failed to update category." };
    }
}

export async function deleteCategory(formData: FormData) {
    const id = formData.get("id");
    try {
        await db.execute({ sql: 'DELETE FROM categories WHERE id = ?', args: [id as string] });
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete category:", e);
        return { success: false, error: e.message || "Failed to delete category." };
    }
}
