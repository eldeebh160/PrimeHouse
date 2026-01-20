export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-24 sm:px-8 max-w-4xl space-y-12">
            <div className="text-center space-y-4">
                <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-widest text-black">Terms of Service</h1>
                <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">Last Updated: December 2024</p>
            </div>

            <div className="space-y-8 text-neutral-800 leading-relaxed font-light">
                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">1. Acceptance of Terms</h2>
                    <p>
                        By accessing the PrimeHouse website and utilizing our services, including our AR Showroom and
                        appointment booking system, you agree to be bound by these Terms of Service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">2. Private Appointments</h2>
                    <p>
                        Appointments booked through our website are requests for private viewings and are subject
                        to confirmation by the PrimeHouse concierge team. We reserve the right to reschedule
                        or cancel appointments based on showroom availability.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">3. Intellectual Property</h2>
                    <p>
                        All content on this website, including designs, photography, brand identity, and the
                        Ar Showroom technology, is the property of PrimeHouse and is protected by copyright laws.
                        Unauthorized use of any materials is strictly prohibited.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">4. Product Representation</h2>
                    <p>
                        While we strive to represent our collection with absolute accuracy, final products
                        viewed in person may have slight variations in texture or color compared to digital
                        representations. PrimeHouse is not liable for minor discrepancies.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">5. Limitation of Liability</h2>
                    <p>
                        PrimeHouse shall not be liable for any direct, indirect, or consequential damages
                        resulting from the use or inability to use our website or showroom services.
                    </p>
                </section>
            </div>

            <div className="h-px w-24 bg-black mx-auto my-8"></div>
        </div>
    );
}
