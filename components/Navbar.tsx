import Link from "next/link";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-black text-white p-2 flex flex-col items-center justify-center leading-none">
                        <span className="font-[family-name:var(--font-spartan)] text-lg font-bold tracking-tighter">PH</span>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-[family-name:var(--font-spartan)] text-lg font-bold tracking-tight uppercase">PrimeHouse</span>
                        <span className="text-[7px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Collective Trading</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden items-center gap-8 md:flex">
                    <Link href="/shop" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary uppercase tracking-wide">
                        Collection
                    </Link>
                    <Link href="/showroom" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary uppercase tracking-wide">
                        AR Showroom
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary uppercase tracking-wide">
                        Our Story
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/appointments" className="hidden sm:block rounded-full bg-primary px-6 py-2 text-xs font-bold text-primary-foreground uppercase tracking-widest transition-all hover:opacity-90">
                        Book Visit
                    </Link>
                </div>
            </div>
        </nav>
    );
}
