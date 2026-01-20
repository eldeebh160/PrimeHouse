import db from "@/lib/db";
import AppointmentsList from "@/components/admin/AppointmentsList";

export const dynamic = 'force-dynamic';

export default async function AdminAppointmentsPage() {
    // Fetch all appointments
    const result = await db.execute('SELECT * FROM appointments ORDER BY created_at DESC');
    const appointments = result.rows as any[];

    return (
        <AppointmentsList initialAppointments={appointments} />
    );
}
