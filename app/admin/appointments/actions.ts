"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleAppointmentStatus(id: number, currentStatus: string) {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    await db.execute({ sql: 'UPDATE appointments SET status = ? WHERE id = ?', args: [newStatus, id] });

    revalidatePath("/admin/appointments");
    return { success: true, status: newStatus };
}

export async function deleteAppointment(id: number) {
    await db.execute({ sql: 'DELETE FROM appointments WHERE id = ?', args: [id] });

    revalidatePath("/admin/appointments");
    return { success: true };
}
