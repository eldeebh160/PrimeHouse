import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
            <span className="text-9xl font-bold text-gray-100 select-none">404</span>
            <h1 className="text-3xl font-bold font-heading -mt-12 mb-4">Page Not Found</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="group flex items-center gap-2 bg-black text-white px-8 py-4 uppercase font-bold tracking-widest text-sm hover:bg-gray-800 transition-colors"
            >
                Return Home <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
