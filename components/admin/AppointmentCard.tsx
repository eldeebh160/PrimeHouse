"use client";

import { useState } from "react";
import { Mail, Calendar, User, MessageSquare, Phone, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toggleAppointmentStatus, deleteAppointment } from "@/app/admin/appointments/actions";
import { toast } from "sonner";

export default function AppointmentCard({ appointment }: { appointment: any }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusToggle = async () => {
        setIsLoading(true);
        try {
            await toggleAppointmentStatus(appointment.id, appointment.status);
            toast.success(`Appointment marked as ${appointment.status === 'pending' ? 'completed' : 'pending'}`);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this appointment?")) return;

        setIsLoading(true);
        try {
            await deleteAppointment(appointment.id);
            toast.success("Appointment deleted");
        } catch (error) {
            toast.error("Failed to delete appointment");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background border border-border p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-full">
                            <User size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{appointment.first_name} {appointment.last_name}</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{appointment.interest}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail size={14} />
                            <span>{appointment.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone size={14} />
                            <span>{appointment.phone || "No phone provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={14} />
                            <span>{appointment.preferred_date}</span>
                        </div>
                    </div>

                    {appointment.message && (
                        <div className="bg-secondary/30 p-4 rounded-sm border border-border/50">
                            <div className="flex items-start gap-2 text-sm">
                                <MessageSquare size={14} className="mt-1 text-muted-foreground" />
                                <p className="italic text-muted-foreground">"{appointment.message}"</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                        {appointment.status}
                    </span>
                    <div className="text-[10px] text-muted-foreground font-mono">
                        Received: {new Date(appointment.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleStatusToggle}
                            disabled={isLoading}
                            className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest border-b pb-1 transition-colors ${appointment.status === 'pending'
                                    ? 'border-green-600 text-green-600 hover:text-green-800'
                                    : 'border-yellow-600 text-yellow-600 hover:text-yellow-800'
                                }`}
                        >
                            {appointment.status === 'pending' ? (
                                <>
                                    <CheckCircle size={14} /> Complete
                                </>
                            ) : (
                                <>
                                    <XCircle size={14} /> Pending
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest border-b border-red-600 text-red-600 pb-1 hover:text-red-800 transition-colors ml-4"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
