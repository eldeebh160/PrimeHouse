import type { Metadata } from "next";
import { Inter, Outfit, League_Spartan } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spartan = League_Spartan({ subsets: ["latin"], variable: "--font-spartan" });

export const metadata: Metadata = {
    title: {
        default: "PrimeHouse | Collective Trading & Luxury Lifestyle",
        template: "%s | PrimeHouse"
    },
    description: "The premier destination for luxury furniture, wellness technology, and elite lifestyle products in Egypt.",
    keywords: ["Luxury Furniture", "Massage Chairs", "Interior Design", "PrimeHouse", "Egypt", "Wellness"],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://primehousetrading.com",
        siteName: "PrimeHouse",
        images: [
            {
                url: "/og-image.jpg", // We need to add this eventually, but good for structure
                width: 1200,
                height: 630,
                alt: "PrimeHouse Luxury Lifestyle",
            },
        ],
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable} ${spartan.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-black selection:text-white`}>
                <Navbar />
                <main className="flex-1 w-full">
                    {children}
                </main>
                <Footer />
                <Toaster />
            </body>
        </html>
    );
}
