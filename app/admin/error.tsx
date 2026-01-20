"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h2 className="text-xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground">{error.message}</p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-black text-white rounded-sm hover:bg-gray-800"
            >
                Try again
            </button>
        </div>
    );
}
