import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    Tags,
    Percent,
    Upload,
    LogOut,
    CalendarCheck
} from "lucide-react";

import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-secondary/30 text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="font-heading text-xl font-bold tracking-widest text-primary">ADMIN</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Overview" />
                    <NavItem href="/admin/products" icon={<Package size={18} />} label="Products" />
                    <NavItem href="/admin/categories" icon={<Tags size={18} />} label="Categories" />
                    <NavItem href="/admin/appointments" icon={<CalendarCheck size={18} />} label="Appointments" />
                    <NavItem href="/admin/import" icon={<Upload size={18} />} label="Import Data" />
                </nav>

                <div className="p-4 border-t border-border">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors rounded-sm"
        >
            {icon}
            {label}
        </Link>
    );
}
