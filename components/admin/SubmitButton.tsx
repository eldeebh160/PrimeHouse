"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
    children: React.ReactNode;
    pendingText?: string;
    className?: string;
}

export function SubmitButton({
    children,
    pendingText = "Saving...",
    className = "bg-black text-white px-6 py-2 uppercase font-bold text-xs tracking-widest hover:bg-gray-800 disabled:bg-gray-400"
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`${className} flex items-center justify-center gap-2 transition-all`}
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {pendingText}
                </>
            ) : (
                children
            )}
        </button>
    );
}
