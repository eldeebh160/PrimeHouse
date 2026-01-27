"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import { Plus, X } from "lucide-react";
import { updateProduct } from "../actions";
import Image from "next/image";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditProductForm({ product, initialVariants, categories, initialImages }: { product: any, initialVariants: any[], categories: any[], initialImages: any[] }) {
    const router = useRouter();
    const [variants, setVariants] = useState<{ name: string, value: string, price?: string | number }[]>(initialVariants.map(v => ({ name: v.name, value: v.value, price: v.price || "" })));

    // Image State
    // We unify existing and new images into a single list for drag-and-drop
    type ImageItem =
        | { type: "existing", id: number, url: string }
        | { type: "new", id: string, file: File, previewUrl: string };

    const [items, setItems] = useState<ImageItem[]>(initialImages.map(img => ({ type: "existing", id: img.id, url: img.url })));

    // UI Helpers copied from create form
    const addVariant = () => setVariants([...variants, { name: "", value: "", price: "" }]);
    const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
    const updateVariant = (i: number, field: string, val: string) => {
        const newVariants = [...variants] as any[];
        newVariants[i][field] = val;
        setVariants(newVariants);
    };

    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                type: "new" as const,
                id: `new-${Date.now()}-${Math.random()}`,
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            setItems([...items, ...newFiles]);
        }
    };

    const removeImage = (id: number | string) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Prepare FormData
    const handleSubmit = async (formData: FormData) => {
        const newImagesList = items.filter(item => item.type === 'new') as { type: 'new', file: File }[];

        const layout = items.map(item => {
            if (item.type === 'existing') {
                return { type: 'existing', url: item.url };
            } else {
                const index = newImagesList.findIndex(n => n.file === item.file);
                return { type: 'new', index };
            }
        });

        formData.append('image_order', JSON.stringify(layout));

        newImagesList.forEach(item => {
            formData.append('images', item.file);
        });

        const result = await updateProduct(formData);
        if (result.success) {
            toast.success("Product updated successfully");
            router.push("/admin/products");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update product");
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8">
            <input type="hidden" name="id" value={product.id} />

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Name</label>
                    <input name="name" defaultValue={product.name} required className="w-full bg-secondary border border-border px-4 py-2" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Category</label>
                    <select name="category_id" defaultValue={product.category_id} className="w-full bg-secondary border border-border px-4 py-2">
                        <option value="">Select Category</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.parent_name ? `${cat.parent_name} > ${cat.name}` : cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Price (EGP)</label>
                    <input name="price" type="number" step="1" defaultValue={product.price} required className="w-full bg-secondary border border-border px-4 py-2" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Sale Price (EGP) - Optional</label>
                    <input name="sale_price" type="number" step="1" defaultValue={product.sale_price} className="w-full bg-secondary border border-border px-4 py-2" />
                </div>
            </div>

            <div className="space-y-4 py-2">
                <label className="flex items-center gap-3 cursor-pointer group w-max">
                    <div className="relative">
                        <input type="checkbox" name="is_featured" defaultChecked={!!product.is_featured} className="peer sr-only" />
                        <div className="w-10 h-6 bg-secondary border border-border rounded-full peer peer-checked:bg-black transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                    </div>
                    <span className="text-xs uppercase font-bold text-muted-foreground group-hover:text-black transition-colors">Featured / In Focus (Home Page)</span>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Description</label>
                    <textarea name="description" defaultValue={product.description} rows={4} className="w-full bg-secondary border border-border px-4 py-2 resize-none"></textarea>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-muted-foreground">Key Features (One per line)</label>
                    <textarea name="features" defaultValue={product.features} rows={4} className="w-full bg-secondary border border-border px-4 py-2 resize-none" placeholder="Ergonomic design&#10;Premium leather&#10;Smart connectivity"></textarea>
                </div>
            </div>

            {/* Images - Reorderable */}
            <div className="space-y-4 border-t border-border pt-6">
                <label className="text-xs uppercase font-bold text-muted-foreground block">Product Images (Drag to Reorder)</label>

                <Reorder.Group axis="x" values={items} onReorder={setItems} className="flex flex-wrap gap-4">
                    {items.map((item) => (
                        <Reorder.Item key={item.id} value={item} className="relative w-24 h-24 bg-gray-100 border rounded-sm cursor-grab active:cursor-grabbing group">
                            <Image
                                src={item.type === 'existing' ? item.url : item.previewUrl}
                                alt="Product"
                                fill
                                className="object-cover pointer-events-none"
                            />
                            {item.type === 'new' && (
                                <div className="absolute top-0 right-0 bg-primary text-white text-[8px] px-1 z-10">NEW</div>
                            )}
                            <button
                                type="button"
                                onClick={() => removeImage(item.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Reorder.Item>
                    ))}

                    <label className="w-24 h-24 border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Add</span>
                        <input type="file" multiple accept="image/*" onChange={handleNewImageChange} className="hidden" />
                    </label>
                </Reorder.Group>
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

            <SubmitButton className="w-full bg-black text-white h-12 font-bold uppercase tracking-widest hover:bg-gray-800">
                Update Product
            </SubmitButton>
        </form>
    );
}
