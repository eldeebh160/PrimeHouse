export default function ShowroomPage() {
    return (
        <div className="container mx-auto px-4 py-24 sm:px-8 max-w-4xl text-center space-y-12">
            <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Coming Soon</span>
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Augmented Reality Showroom</h1>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    Visualize our collection in your own space. Point your camera, select a product, and see how it fits instantly.
                </p>
            </div>

            <div className="aspect-video w-full bg-secondary rounded-sm flex items-center justify-center border border-border">
                <p className="text-muted-foreground font-mono text-sm">AR Module Loading...</p>
            </div>

            <div className="flex justify-center gap-4">
                <button className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                    Launch Demo
                </button>
            </div>
        </div>
    );
}
