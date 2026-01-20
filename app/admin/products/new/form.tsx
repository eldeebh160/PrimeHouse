"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createProduct } from "../actions";

interface Category {
    id: number;
    name: string;
}

export default function NewProductForm({ categories }: { categories: Category[] }) {
    // Form State
    const [variants, setVariants] = useState<{ name: string, value: string, price?: string | number }[]>([]);
    const [images, setImages] = useState<File[]>([]);

    // UI Helpers
    const addVariant = () => setVariants([...variants, { name: "", value: "", price: "" }]);
    const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
    const updateVariant = (i: number, field: string, val: string) => {
        const newVariants = [...variants] as any[];
        newVariants[i][field] = val;
        setVariants(newVariants);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages([...images, ...Array.from(e.target.files)]);
        }
    };

    return (
        <form action={createProduct} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Name</label>
                    <input name="name" required className="w-full bg-secondary border border-border px-4 py-2" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Category</label>
                    <select name="category_id" className="w-full bg-secondary border border-border px-4 py-2">
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Price (EGP)</label>
                    <input name="price" type="number" step="1" required className="w-full bg-secondary border border-border px-4 py-2" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Sale Price (EGP) - Optional</label>
                    <input name="sale_price" type="number" step="1" className="w-full bg-secondary border border-border px-4 py-2" />
                </div>
            </div>

            <div className="space-y-4 py-2">
                <label className="flex items-center gap-3 cursor-pointer group w-max">
                    <div className="relative">
                        <input type="checkbox" name="is_featured" className="peer sr-only" />
                        <div className="w-10 h-6 bg-secondary border border-border rounded-full peer peer-checked:bg-black transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                    </div>
                    <span className="text-xs uppercase font-bold text-muted-foreground group-hover:text-black transition-colors">Featured / In Focus (Home Page)</span>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Description</label>
                    <textarea name="description" rows={4} className="w-full bg-secondary border border-border px-4 py-2 resize-none"></textarea>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Key Features (One per line)</label>
                    <textarea name="features" rows={4} className="w-full bg-secondary border border-border px-4 py-2 resize-none" placeholder="Ergonomic design&#10;Premium leather&#10;Smart connectivity"></textarea>
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4 border-t border-border pt-6">
                <label className="text-xs uppercase font-bold text-muted-foreground block">Product Images</label>
                <div className="flex flex-wrap gap-4">
                    {images.map((img, i) => (
                        <div key={i} className="relative w-24 h-24 bg-gray-100 border rounded-sm flex items-center justify-center overflow-hidden">
                            <span className="text-xs text-muted-foreground truncate px-2">{img.name}</span>
                        </div>
                    ))}
                    <label className="w-24 h-24 border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Add</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" name="images" />
                    </label>
                </div>
            </div>

            {/* Variants */}
            <div className="space-y-4 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Variants & Custom Prices</label>
                    <button type="button" onClick={addVariant} className="text-xs font-bold flex items-center gap-1 hover:text-primary">
                        <Plus className="w-3 h-3" /> Add Variant
                    </button>
                </div>

                {variants.map((v: any, i) => (
                    <div key={i} className="flex gap-4 items-end">
                        <div className="flex-[2] space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Type</label>
                            <input
                                placeholder="Color, size etc."
                                value={v.name}
                                onChange={(e) => updateVariant(i, 'name', e.target.value)}
                                className="w-full bg-secondary border border-border px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex-[2] space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Value</label>
                            <input
                                placeholder="Black, XL etc."
                                value={v.value}
                                onChange={(e) => updateVariant(i, 'value', e.target.value)}
                                className="w-full bg-secondary border border-border px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex-[1] space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Price (Optional)</label>
                            <input
                                type="number"
                                step="1"
                                placeholder="Custom Price"
                                value={v.price || ""}
                                onChange={(e) => updateVariant(i, 'price', e.target.value)}
                                className="w-full bg-secondary border border-border px-3 py-2 text-sm"
                            />
                        </div>
                        <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700 mb-2">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <input type="hidden" name="variants_json" value={JSON.stringify(variants)} />
            </div>

            <button type="submit" className="w-full bg-black text-white h-12 font-bold uppercase tracking-widest hover:bg-gray-800">
                Create Product
            </button>
        </form>
    );
}
