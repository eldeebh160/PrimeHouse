import { ProductCard } from "@/components/ui/ProductCard";
import db from "@/lib/db";
import Link from "next/link";

// Force dynamic rendering so we always get the latest data
export const dynamic = 'force-dynamic';

interface Product {
    id: number;
    name: string;
    price: number;
    sale_price: number | null;
    image_url: string;
    category_name: string;
}

export default async function ShopPage({ searchParams }: { searchParams: { category?: string, sort?: string } }) {
    const selectedCategoryId = searchParams.category;
    const selectedSort = searchParams.sort || 'newest';

    // Fetch Categories for Sidebar
    const categoriesResult = await db.execute('SELECT id, name FROM categories ORDER BY name');
    const categories = categoriesResult.rows as unknown as { id: number, name: string }[];

    // Build Product Query
    let query = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
    `;
    let params: any[] = [];

    if (selectedCategoryId) {
        query += ` WHERE p.category_id = ? `;
        params.push(selectedCategoryId);
    }

    // Handle Sorting
    switch (selectedSort) {
        case 'price-asc':
            query += ` ORDER BY p.price ASC `;
            break;
        case 'price-desc':
            query += ` ORDER BY p.price DESC `;
            break;
        case 'name-asc':
            query += ` ORDER BY p.name ASC `;
            break;
        case 'newest':
        default:
            query += ` ORDER BY p.id DESC `;
            break;
    }

    const productsResult = await db.execute({ sql: query, args: params });
    const products = productsResult.rows as unknown as Product[];

    const sortOptions = [
        { label: 'Newest Arrivals', value: 'newest' },
        { label: 'Price: Low to High', value: 'price-asc' },
        { label: 'Price: High to Low', value: 'price-desc' },
        { label: 'Name: A-Z', value: 'name-asc' },
    ];

    return (
        <div className="container mx-auto px-4 py-8 sm:px-8 sm:py-16">
            {/* Header */}
            <div className="mb-16 space-y-6 text-center max-w-3xl mx-auto">
                <h1 className="font-heading text-5xl font-bold tracking-tight">The Collection</h1>
                <p className="text-muted-foreground text-lg font-light leading-relaxed">
                    Designed for comfort, engineered for wellness. Explore our exclusive range of premium furniture available for viewing in our augmented reality showroom.
                </p>
            </div>

            <div className="flex flex-col gap-12 lg:flex-row">
                {/* Sidebar Filter */}
                <aside className="w-full lg:w-64 flex-none space-y-10">
                    <div>
                        <h3 className="font-sans text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2">Category</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    href={selectedSort !== 'newest' ? `/shop?sort=${selectedSort}` : "/shop"}
                                    className={`transition-colors ${!selectedCategoryId ? "text-foreground font-bold underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    All Products
                                </Link>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/shop?category=${cat.id}${selectedSort !== 'newest' ? `&sort=${selectedSort}` : ''}`}
                                        className={`transition-colors ${selectedCategoryId === String(cat.id) ? "text-foreground font-bold underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Product Grid Area */}
                <div className="flex-1 space-y-8">
                    {/* Top Sort Bar */}
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
                            {products.length} Products Found
                        </span>
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground hidden sm:block">Sort By:</span>
                            <div className="flex gap-4">
                                {sortOptions.map(option => (
                                    <Link
                                        key={option.value}
                                        href={`${selectedCategoryId ? `/shop?category=${selectedCategoryId}&` : '/shop?'}sort=${option.value}`}
                                        className={`text-[10px] uppercase font-bold tracking-widest transition-colors pb-1 border-b-2 ${selectedSort === option.value ? "border-black text-black" : "border-transparent text-muted-foreground hover:text-black"}`}
                                    >
                                        {option.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center text-muted-foreground">
                            No products found in this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
