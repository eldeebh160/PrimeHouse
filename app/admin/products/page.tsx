import db from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "./actions";
import { formatPrice } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function ProductsListPage() {
    const result = await db.execute(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        ORDER BY p.id DESC
    `);
    const products = result.rows as any[];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="font-heading text-3xl font-bold">Products</h1>
                <Link href="/admin/products/new" className="bg-black text-white px-6 py-3 uppercase font-bold text-xs tracking-widest hover:bg-gray-800 flex items-center gap-2">
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            <div className="bg-background border border-border rounded-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary text-xs uppercase tracking-widest font-bold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-16 bg-secondary flex items-center justify-center overflow-hidden border border-border">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[9px] text-muted-foreground">NO IMG</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold">{product.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{product.category_name || 'Uncategorized'}</td>
                                <td className="px-6 py-4 font-mono">
                                    {product.sale_price ? (
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground line-through text-xs font-sans">{formatPrice(product.price)}</span>
                                            <span className="text-red-600 font-bold font-sans">{formatPrice(product.sale_price)}</span>
                                        </div>
                                    ) : (
                                        <span className="font-sans">{formatPrice(product.price)}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/products/${product.id}`} className="p-2 hover:text-black text-muted-foreground transition-colors">
                                            <Pencil size={16} />
                                        </Link>
                                        <form action={deleteProduct}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <button type="submit" className="p-2 hover:text-red-500 text-muted-foreground transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
