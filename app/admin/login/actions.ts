"use server";

import { cookies } from "next/headers";

export async function authenticateAdmin(password: string) {
    const correctPassword = process.env.ADMIN_PASSWORD || "Hadari1612";

    if (password === correctPassword) {
        // Set cookie (valid for 7 days)
        const cookieStore = await cookies();
        cookieStore.set("admin_auth", correctPassword, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });
        return { success: true };
    }

    return { success: false, error: "Incorrect password. Please try again." };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_auth");
}
