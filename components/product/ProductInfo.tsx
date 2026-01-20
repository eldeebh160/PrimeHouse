"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
    product: {
        id: number;
        name: string;
        price: number;
        description: string;
        features?: string;
    },
    variants?: { name: string, value: string, price?: number | null }[]
}

export function ProductInfo({ product, variants = [] }: ProductInfoProps) {
    // Process features from string to array
    const features = product.features
        ? product.features.split('\n').filter(f => f.trim() !== '')
        : [];

    // Group variants by type
    const groupedVariants: Record<string, { value: string, price?: number | null }[]> = {};
    variants.forEach(v => {
        if (!groupedVariants[v.name]) groupedVariants[v.name] = [];
        groupedVariants[v.name].push({ value: v.value, price: v.price });
    });

    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(
        Object.fromEntries(Object.entries(groupedVariants).map(([type, items]) => [type, items[0].value]))
    );

    // Calculate effective price: Base Price OR the price of the last selected variant that has one
    // (In a more complex system, this would be SKU-based, but here we'll use the most specific price)
    let displayPrice = product.price;
    Object.entries(selectedVariants).forEach(([type, val]) => {
        const match = groupedVariants[type].find(item => item.value === val);
        if (match?.price) displayPrice = match.price;
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl text-muted-foreground font-light">{formatPrice(displayPrice)}</p>
            </div>

            <div className="prose prose-sm text-muted-foreground">
                <p>{product.description || "No description available."}</p>
            </div>

            {/* Variants */}
            <div className="space-y-6">
                {Object.entries(groupedVariants).map(([type, items]) => (
                    <div key={type} className="space-y-3">
                        <span className="text-sm font-bold uppercase tracking-widest">{type}: {selectedVariants[type]}</span>
                        <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                                <button
                                    key={item.value}
                                    onClick={() => setSelectedVariants(prev => ({ ...prev, [type]: item.value }))}
                                    className={`h-10 px-4 border text-sm transition-all flex items-center gap-2 ${selectedVariants[type] === item.value
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border hover:border-muted-foreground"
                                        }`}
                                >
                                    <span>{item.value}</span>
                                    {item.price && item.price !== product.price && (
                                        <span className={`text-[10px] opacity-70 ${selectedVariants[type] === item.value ? "text-primary-foreground" : "text-muted-foreground"}`}>
                                            ({formatPrice(item.price)})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {features.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-border">
                    <h4 className="text-sm font-bold uppercase tracking-widest">Key Features</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-primary" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div className="pt-8">
                <Link href="/appointments" className="w-full sm:w-auto bg-primary text-primary-foreground h-14 px-8 flex items-center justify-center gap-2 uppercase tracking-widest font-bold hover:opacity-90 transition-opacity">
                    Book a Private Viewing <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-muted-foreground mt-4 text-center sm:text-left">
                    *Available for viewing at our Downtown Showroom.
                </p>
            </div>
        </div>
    );
}
