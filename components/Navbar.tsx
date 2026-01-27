"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-6 sm:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="bg-black text-white p-2 flex flex-col items-center justify-center leading-none">
                        <span className="font-[family-name:var(--font-spartan)] text-lg font-bold tracking-tighter">PH</span>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-[family-name:var(--font-spartan)] text-base md:text-lg font-bold tracking-tight uppercase">PrimeHouse</span>
                        <span className="text-[7px] font-bold tracking-[0.2em] text-muted-foreground uppercase hidden xs:block">Collective Trading</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden items-center gap-8 md:flex">
                    <Link href="/shop" className="text-xs font-bold text-muted-foreground transition-colors hover:text-primary uppercase tracking-widest">
                        Collection
                    </Link>
                    <Link href="/showroom" className="text-xs font-bold text-muted-foreground transition-colors hover:text-primary uppercase tracking-widest">
                        AR Showroom
                    </Link>
                    <Link href="/about" className="text-xs font-bold text-muted-foreground transition-colors hover:text-primary uppercase tracking-widest">
                        Our Story
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/appointments" className="hidden sm:block rounded-full bg-primary px-6 py-2 text-[10px] font-bold text-primary-foreground uppercase tracking-widest transition-all hover:opacity-90">
                        Book Visit
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 md:hidden text-black hover:bg-secondary rounded-sm transition-colors"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-border shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex flex-col p-6 space-y-4">
                        <Link
                            href="/shop"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-black py-2"
                        >
                            Collection
                        </Link>
                        <Link
                            href="/showroom"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-black py-2"
                        >
                            AR Showroom
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-black py-2"
                        >
                            Our Story
                        </Link>
                        <Link
                            href="/appointments"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-black text-white px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] rounded-sm mt-4 active:scale-[0.98] transition-transform"
                        >
                            Book Visit
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
