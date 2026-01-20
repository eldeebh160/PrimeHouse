"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

import nodemailer from 'nodemailer';
import rateLimit from '@/lib/rate-limit';
import { headers } from 'next/headers';

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function createAppointment(formData: FormData) {
    try {
        // Rate Limiting: 3 requests per minute per IP
        const ip = headers().get('x-forwarded-for') || 'anonymous';
        await limiter.check(3, ip);
    } catch {
        // If rate limited
        return { success: false, error: "Too many requests. Please try again later." };
    }

    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const preferredDate = formData.get("preferred_date") as string;
    const interest = formData.get("interest") as string;
    const message = formData.get("message") as string;

    // 1. Save to Database
    await db.execute({
        sql: `INSERT INTO appointments (first_name, last_name, email, phone, preferred_date, interest, message)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [firstName, lastName, email, phone, preferredDate, interest, message]
    });

    // 2. Send Email Notification
    try {
        const transporter = nodemailer.createTransport({
            service: "hotmail", // Helper for outlook/hotmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "primehousetrading@hotmail.com",
            subject: `New Appointment Request: ${firstName} ${lastName}`,
            text: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Date: ${preferredDate}
Interest: ${interest}

Message:
${message}
            `,
            html: `
<h3>New Appointment Request</h3>
<p><strong>Name:</strong> ${firstName} ${lastName}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Date:</strong> ${preferredDate}</p>
<p><strong>Interest:</strong> ${interest}</p>
<br/>
<p><strong>Message:</strong></p>
<p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Failed to send email:", error);
        // We don't block the user if email fails, but we log it
    }

    revalidatePath("/admin/appointments");
    return { success: true };
}
