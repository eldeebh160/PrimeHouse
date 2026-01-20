"use client";

import { useState } from "react";
import AppointmentCard from "@/components/admin/AppointmentCard";
import { Search } from "lucide-react";

export default function AppointmentsList({ initialAppointments }: { initialAppointments: any[] }) {
    const [search, setSearch] = useState("");

    // Sort logic, if needed, but standard SQL order is likely fine.
    // Client-side filtering
    const filtered = initialAppointments.filter(appt => {
        const query = search.toLowerCase();
        return (
            appt.first_name.toLowerCase().includes(query) ||
            appt.last_name.toLowerCase().includes(query) ||
            appt.email.toLowerCase().includes(query) ||
            (appt.phone && appt.phone.toLowerCase().includes(query)) ||
            (appt.interest && appt.interest.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="font-heading text-3xl font-bold">Appointments</h1>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search appointments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-black transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filtered.length > 0 ? (
                    filtered.map((appt) => (
                        <AppointmentCard key={appt.id} appointment={appt} />
                    ))
                ) : (
                    <div className="py-24 text-center border-2 border-dashed border-border rounded-sm">
                        <p className="text-muted-foreground">No appointments found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
