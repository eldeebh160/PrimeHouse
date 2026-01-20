"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images?: string[];
}

export function ProductGallery({ images = [] }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Filter out any potential empty strings or nulls
    const displayImages = images.filter(img => !!img);

    if (displayImages.length === 0) {
        return (
            <div className="relative aspect-[4/5] w-full bg-secondary overflow-hidden flex items-center justify-center">
                <p className="text-muted-foreground">No images available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col-reverse gap-4 md:flex-row">
            {/* Thumbnails - Only show if more than one image */}
            {displayImages.length > 1 && (
                <div className="flex gap-4 md:flex-col overflow-x-auto md:w-24 flex-none scrollbar-hide">
                    {displayImages.map((img, i) => (
                        <button
                            key={i}
                            className={`relative aspect-square w-20 md:w-full flex-none overflow-hidden bg-secondary transition-all ${selectedIndex === i ? "ring-1 ring-primary" : "ring-1 ring-transparent hover:ring-border"
                                }`}
                            onClick={() => setSelectedIndex(i)}
                        >
                            <Image
                                src={img}
                                alt={`Product thumbnail ${i + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main Image */}
            <div className="relative aspect-[4/5] w-full flex-1 bg-secondary overflow-hidden">
                <Image
                    src={displayImages[selectedIndex]}
                    alt="Product image"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}
