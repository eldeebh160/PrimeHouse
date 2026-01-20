"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { logoutAdmin } from "@/app/admin/login/actions";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await logoutAdmin();
        router.push("/");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-black transition-colors rounded-sm"
        >
            <LogOut size={18} />
            Exit Admin
        </button>
    );
}
