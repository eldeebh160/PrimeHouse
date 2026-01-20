"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { authenticateAdmin } from "./actions";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await authenticateAdmin(password);
            if (result.success) {
                router.push("/admin");
                router.refresh();
            } else {
                setError(result.error || "Authentication failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 space-y-8 rounded-sm">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-white flex items-center justify-center rounded-full mb-4">
                        <Lock className="text-black" size={20} />
                    </div>
                    <h1 className="text-white text-2xl font-bold uppercase tracking-widest font-heading">PrimeHouse</h1>
                    <p className="text-neutral-500 text-xs uppercase tracking-[0.3em]">Protected Admin Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Access Key</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-red-500 text-[10px] uppercase font-bold text-center tracking-widest">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-white text-black py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-colors"
                    >
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}
