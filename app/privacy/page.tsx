export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-24 sm:px-8 max-w-4xl space-y-12">
            <div className="text-center space-y-4">
                <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-widest text-black">Privacy Policy</h1>
                <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">Last Updated: December 2024</p>
            </div>

            <div className="space-y-8 text-neutral-800 leading-relaxed font-light">
                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">1. Information We Collect</h2>
                    <p>
                        At PrimeHouse, we collect information that you provides directly to us when booking an appointment,
                        making an inquiry, or signing up for our newsletter. This includes your name, email address,
                        phone number, and any specific interests you share regarding our collections.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Coordinate and confirm your private showroom appointments.</li>
                        <li>Provide personalized design consultations.</li>
                        <li>Communicate updates regarding new collection arrivals.</li>
                        <li>Enhance our website experience through analytics.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">3. Data Security</h2>
                    <p>
                        We implement localized and industry-standard security measures to protect your personal information.
                        Your data is never sold to third parties. We only share data with essential service providers
                        (e.g., email platforms) required to fulfill our services to you.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">4. Cookies</h2>
                    <p>
                        Our website uses cookies to provide a seamless browsing experience and to understand how
                        visitors interact with our AR showroom and collections.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at
                        <span className="font-bold ml-1">primehousetrading@hotmail.com</span>.
                    </p>
                </section>
            </div>

            <div className="h-px w-24 bg-black mx-auto my-8"></div>
        </div>
    );
}
