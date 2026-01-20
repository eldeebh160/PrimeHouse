import db from "@/lib/db";
import { Package, Tags, Percent } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Quick Stats
    const productResult = await db.execute('SELECT count(*) as count FROM products');
    const productCount = (productResult.rows[0] as any).count;

    const categoryResult = await db.execute('SELECT count(*) as count FROM categories');
    const categoryCount = (categoryResult.rows[0] as any).count;

    const discountResult = await db.execute('SELECT count(*) as count FROM products WHERE sale_price IS NOT NULL');
    const discountCount = (discountResult.rows[0] as any).count;

    return (
        <div className="space-y-8">
            <h1 className="font-heading text-3xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Products"
                    value={productCount}
                    icon={<Package className="w-6 h-6 text-blue-500" />}
                    subtext="Items in inventory"
                />
                <StatCard
                    title="Active Categories"
                    value={categoryCount}
                    icon={<Tags className="w-6 h-6 text-purple-500" />}
                    subtext="Product types"
                />
                <StatCard
                    title="Items on Sale"
                    value={discountCount}
                    icon={<Percent className="w-6 h-6 text-green-500" />}
                    subtext="Discounted products"
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, subtext }: any) {
    return (
        <div className="bg-background border border-border p-6 rounded-sm shadow-sm space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
                {icon}
            </div>
            <div className="text-4xl font-bold font-heading">{value}</div>
            <p className="text-xs text-muted-foreground">{subtext}</p>
        </div>
    );
}
