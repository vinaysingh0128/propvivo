'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [role, setRole] = useState("Employee");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
			const res = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, passwordHash: password, firstName, lastName, role })
            });
            if (!res.ok) {
                const data = await res.text();
                throw new Error(data || "Registration failed");
            }
			router.replace("/login");
		} catch (err: any) {
			setError(err?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-deep via-brand-indigo to-black p-4 text-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-10 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-1/2 h-1/2 bg-brand-muted/20 rounded-full blur-3xl"></div>
            </div>
			<form onSubmit={onSubmit} className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl space-y-6 transition-all hover:border-white/20">
				<div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-lightblue">Join the Team</h1>
                    <p className="text-sm text-gray-400 mt-2">Create your HRMS account</p>
                </div>
				<div className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-muted transition-colors"
                                placeholder="Jane"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-muted transition-colors"
                                placeholder="Doe"
                            />
                        </div>
                    </div>
					<div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-muted transition-colors"
                            placeholder="name@company.com"
                        />
                    </div>
					<div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-muted transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white focus:border-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-muted transition-colors appearance-none"
                        >
                            <option value="Employee" className="bg-gray-900 text-white">Employee</option>
                            <option value="HR" className="bg-gray-900 text-white">HR</option>
                            <option value="Admin" className="bg-gray-900 text-white">Admin</option>
                        </select>
                    </div>
				</div>
				{error ? <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p> : null}
				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-indigo px-4 py-3 text-white font-medium hover:from-brand-blue hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-muted focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
				>
					{loading ? "Creating Account..." : "Register"}
				</button>
                <p className="text-center text-sm text-gray-400 mt-4">
                    Already have an account? <Link href="/login" className="text-brand-lightblue hover:text-brand-lightmuted font-medium transition-colors">Sign in</Link>
                </p>
			</form>
		</div>
	);
}
