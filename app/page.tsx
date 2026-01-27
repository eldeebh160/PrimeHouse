import Link from "next/link";
import { ArrowRight } from "lucide-react";
import db from "@/lib/db";
import Image from "next/image";
import { ShowcaseSlider } from "@/components/ui/ShowcaseSlider";
import { SingleItemCarousel } from "@/components/ui/SingleItemCarousel";
import { ProductCard } from "@/components/ui/ProductCard";

export default async function Home() {
    // Fetch Top-Level Categories for Slider
    const categoriesResult = await db.execute('SELECT * FROM categories WHERE parent_id IS NULL');
    const categories = categoriesResult.rows as any[];

    // Fetch Featured Products (In Focus)
    const featuredResult = await db.execute(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.is_featured = 1 
        ORDER BY p.id DESC
    `);
    const featuredProducts = featuredResult.rows as any[];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] md:h-[90vh] w-full overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black"></div>
                </div>

                <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 md:px-4 max-w-5xl mx-auto space-y-8 md:space-y-12 py-20">
                    <div className="space-y-4">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/70 block mb-4 animate-pulse">Design x Comfort</span>
                        <h1 className="text-5xl md:text-9xl font-bold tracking-tighter text-white uppercase italic font-heading leading-tight drop-shadow-2xl">
                            PrimeHouse.
                        </h1>
                        <p className="text-sm md:text-2xl text-gray-300 max-w-xl md:max-w-2xl mx-auto font-light tracking-[0.2em] md:tracking-[0.4em] uppercase pt-4 leading-relaxed">
                            Collective Trading & Luxury Lifestyle
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-8 pt-6 md:pt-10 w-full sm:w-auto">
                        <Link
                            href="/shop"
                            className="group px-8 md:px-12 py-4 md:py-5 bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 text-xs md:text-sm flex items-center justify-center gap-2"
                        >
                            View Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/appointments"
                            className="group px-8 md:px-12 py-4 md:py-5 border border-white/30 text-white font-bold uppercase tracking-[0.2em] hover:border-white transition-all duration-500 text-xs md:text-sm flex items-center justify-center"
                        >
                            Book Visit
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
                    <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em]">Explore</span>
                    <div className="w-px h-6 md:h-10 bg-gradient-to-b from-white to-transparent"></div>
                </div>
            </section>

            {/* In Focus Slider - MOVED UP */}
            {featuredProducts.length > 0 && (
                <section className="py-12 md:py-24 bg-white overflow-hidden scroll-mt-20">
                    <div className="container mx-auto px-4 md:px-8">
                        <SingleItemCarousel title="In Focus" subtitle="Curated Selection">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="w-full h-full">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </SingleItemCarousel>
                    </div>
                </section>
            )}

            {/* Featured Collections Slider */}
            <section className="py-12 md:py-24 overflow-hidden border-y border-border bg-neutral-50/30">
                <div className="container mx-auto">
                    <ShowcaseSlider title="Collections" subtitle="Explore Our Suites">
                        {categories.map((cat) => (
                            <div key={cat.id} className="group relative w-[280px] md:w-[450px] aspect-[4/5] overflow-hidden bg-secondary">
                                <Link href={`/shop?category=${cat.id}`} className="absolute inset-0 z-30">
                                    <span className="sr-only">View {cat.name} Collection</span>
                                </Link>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-700 z-10" />
                                {cat.image_url ? (
                                    <Image
                                        src={cat.image_url}
                                        alt={cat.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-neutral-100">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 space-y-2 md:space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{cat.name}</h3>
                                    <div className="inline-block text-white border-b border-white pb-1 font-bold text-[8px] md:text-[10px] uppercase tracking-widest hover:border-transparent transition-all">
                                        Explore Collection
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ShowcaseSlider>
                </div>
            </section>

            {/* Brand Statement */}
            <section className="py-24 md:py-32 bg-secondary/30 text-center">
                <div className="max-w-4xl mx-auto px-6 space-y-6 md:space-y-8">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground mr-[-0.3em] md:mr-[-0.4em]">The PrimeHouse Philosophy</span>
                    <h2 className="text-3xl md:text-6xl font-bold font-heading leading-tight tracking-tighter">
                        Crafting spaces that define <span className="italic underline underline-offset-8 decoration-1 decoration-neutral-300">extraordinary</span> living.
                    </h2>
                    <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                        We blend high-performance engineering with artisan-grade aesthetics to create environments that inspire and endure.
                    </p>
                    <div className="pt-6 md:pt-8 flex justify-center">
                        <div className="w-16 md:w-20 h-px bg-black opacity-20"></div>
                    </div>
                </div>
            </section>
        </div>
    );
}
