import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black text-white py-20 px-4 md:px-8 border-t border-neutral-800">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold tracking-tighter uppercase italic font-[family-name:var(--font-spartan)]">
                            PrimeHouse.
                        </h2>
                        <p className="text-neutral-400 text-sm max-w-xs leading-relaxed uppercase tracking-widest font-light">
                            Collective Trading & Luxury Lifestyle. Curating excellence for the modern home.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-neutral-400 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-neutral-400 transition-colors"><Facebook size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Explore</h3>
                        <ul className="space-y-4 text-sm text-neutral-400">
                            <li><Link href="/shop" className="hover:text-white transition-colors">Collection</Link></li>
                            <li><Link href="/showroom" className="hover:text-white transition-colors">AR Showroom</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/appointments" className="hover:text-white transition-colors">Book a Visit</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Contact</h3>
                        <ul className="space-y-4 text-sm text-neutral-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="mt-1 text-white flex-none" />
                                <span>Industrial Area, 5th Settlement, Cairo</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} className="text-white flex-none" />
                                <span>+20 102 502 6956</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={16} className="text-white flex-none" />
                                <span className="break-all">primehousetrading@hotmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                    <p>© 2024 PrimeHouse. All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
