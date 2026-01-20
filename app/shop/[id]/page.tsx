import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Product {
    id: number;
    name: string;
    description: string;
    features: string;
    price: number;
    image_url: string;
    category_id: number;
}

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const result = await db.execute({ sql: 'SELECT * FROM products WHERE id = ?', args: [params.id] });
    const product = result.rows[0] as unknown as Product | undefined;

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: `${product.name} | PrimeHouse`,
        description: product.description || `Discover the ${product.name} at PrimeHouse.`,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [product.image_url],
        },
    };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    // Fetch Product
    const result = await db.execute({ sql: 'SELECT * FROM products WHERE id = ?', args: [params.id] });
    const product = result.rows[0] as unknown as Product | undefined;

    if (!product) {
        notFound();
    }

    const variantsResult = await db.execute({ sql: 'SELECT * FROM product_variants WHERE product_id = ?', args: [params.id] });
    const variants = variantsResult.rows as any[];

    const imagesResult = await db.execute({ sql: 'SELECT url FROM product_images WHERE product_id = ?', args: [params.id] });
    const images = imagesResult.rows as unknown as { url: string }[];
    const imageList = images.length > 0 ? images.map(img => img.url) : [product.image_url].filter(Boolean);

    return (
        <div className="container mx-auto px-4 py-8 sm:px-8 sm:py-16">
            {/* Breadcrumb */}
            <div className="mb-8 pl-1">
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-black transition-colors uppercase tracking-wider">
                    ← Back to Shop
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <ProductGallery images={imageList} />
                {/* We pass the plain object which works because we aren't using complex types yet */}
                <ProductInfo product={product} variants={variants} />
            </div>
        </div>
    );
}
