import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
    id: number;
    name: string;
    price: number;
    sale_price: number | null;
    image_url: string;
    category_name: string;
}

export function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group relative flex flex-col space-y-3">
            {/* Image Link */}
            <Link href={`/shop/${product.id}`} className="block group/image">
                <div className="aspect-[4/5] overflow-hidden bg-secondary relative text-muted-foreground">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground font-light text-sm">
                            No Image
                        </div>
                    )}

                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover/image:bg-black/5" />
                </div>
            </Link>

            {/* Info */}
            <div className="flex justify-between items-start pt-2">
                <div>
                    <h3 className="font-heading text-lg font-medium leading-none tracking-tight">{product.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1.5">{product.category_name}</p>
                </div>
                <div className="text-right">
                    {product.sale_price ? (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.price)}</span>
                            <span className="font-bold text-sm text-red-600">{formatPrice(product.sale_price)}</span>
                        </div>
                    ) : (
                        <p className="font-medium text-sm">{formatPrice(product.price)}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
