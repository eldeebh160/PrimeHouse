"use client";

import { useState } from "react";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { createAppointment } from "./actions";

export default function AppointmentsPage() {
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-24 sm:px-8 flex flex-col items-center justify-center text-center min-h-[60vh]">
                <h1 className="font-heading text-4xl font-bold mb-4">Request Received</h1>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    Thank you for your interest. Our concierge team will reach out to you within 24 hours to confirm your private viewing.
                </p>
                <a href="/" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors">
                    Return Home
                </a>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                {/* Information */}
                <div className="space-y-12">
                    <div>
                        <h1 className="font-heading text-5xl font-bold mb-6">Book a Visit</h1>
                        <p className="text-lg text-muted-foreground font-light leading-relaxed">
                            Experience our collection in person. Schedule a private appointment at our flagship showroom to test our products and consult with our design experts.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-secondary rounded-full">
                                <MapPin className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Showroom Location</h3>
                                <p className="text-muted-foreground text-sm">Industrial Area,<br />5th Settlement, Cairo</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-secondary rounded-full">
                                <Phone className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Direct Line</h3>
                                <p className="text-muted-foreground text-sm">+20 102 502 6956</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-secondary rounded-full">
                                <Mail className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Email</h3>
                                <p className="text-muted-foreground text-sm">primehousetrading@hotmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-secondary/30 p-8 rounded-lg border border-border">
                    <form
                        className="space-y-6"
                        action={async (formData) => {
                            await createAppointment(formData);
                            setSubmitted(true);
                        }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</label>
                                <input name="first_name" required type="text" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</label>
                                <input name="last_name" required type="text" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                            <input name="email" required type="email" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="jane@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                            <input name="phone" required type="tel" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="+20 123 456 7890" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preferred Date</label>
                            <input name="preferred_date" required type="date" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interests (Optional)</label>
                            <select name="interest" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors">
                                <option>General Inquiry</option>
                                <option>Massage Chairs</option>
                                <option>Living Room Furniture</option>
                                <option>Interior Design Consultation</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                            <textarea name="message" className="w-full bg-background border border-border px-4 py-3 text-sm h-32 resize-none focus:outline-none focus:border-black transition-colors" placeholder="Tell us about your needs..."></textarea>
                        </div>

                        <SubmitButton />
                    </form>
                </div>
            </div>
        </div>
    );
}

import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full bg-black text-white h-14 flex items-center justify-center gap-2 uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {pending ? "Sending Request..." : (
                <>
                    Request Appointment <ArrowRight className="w-4 h-4" />
                </>
            )}
        </button>
    );
}

