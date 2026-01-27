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
    // Fetch Product with category info
    const result = await db.execute({
        sql: `
            SELECT p.*, c.name as category_name, c.parent_id, cp.name as parent_category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN categories cp ON c.parent_id = cp.id
            WHERE p.id = ?
        `,
        args: [params.id]
    });
    const product = result.rows[0] as any;

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
            <div className="mb-8 pl-1 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
                <span>/</span>
                {product.parent_category_name && (
                    <>
                        <Link href={`/shop?category=${product.parent_id}`} className="hover:text-black transition-colors">
                            {product.parent_category_name}
                        </Link>
                        <span>/</span>
                    </>
                )}
                <Link href={`/shop?category=${product.category_id}`} className="hover:text-black transition-colors">
                    {product.category_name}
                </Link>
                <span className="hidden sm:inline">/</span>
                <span className="text-black font-bold hidden sm:inline">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <ProductGallery images={imageList} />
                {/* We pass the plain object which works because we aren't using complex types yet */}
                <ProductInfo product={product} variants={variants} />
            </div>
        </div>
    );
}
