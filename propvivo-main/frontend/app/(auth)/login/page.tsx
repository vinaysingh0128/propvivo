'use client';

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "../../../context/SessionContext";
import Link from "next/link";

export default function LoginPage() {
	return (
		<Suspense fallback={<div className="p-6 text-center text-brand-blue">Loading…</div>}>
			<LoginForm />
		</Suspense>
	);
}

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { login } = useSession();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login({ email, password });
			let next = searchParams.get("next") || "/dashboard";
			if (next === "/") next = "/dashboard";
			router.replace(next);
		} catch (err: any) {
			setError(err?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-deep via-brand-indigo to-black p-4 text-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-brand-muted/20 rounded-full blur-3xl"></div>
            </div>
			<form onSubmit={onSubmit} className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl space-y-6 transition-all hover:border-white/20">
				<div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-lightblue">Welcome Back</h1>
                    <p className="text-sm text-gray-400 mt-2">Sign in to your HRMS portal</p>
                </div>
				<div className="space-y-4">
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
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <a href="#" className="text-xs text-brand-lightblue hover:text-brand-lightmuted transition-colors">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-muted transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
				</div>
				{error ? <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p> : null}
				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-indigo px-4 py-3 text-white font-medium hover:from-brand-blue hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-muted focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
				>
					{loading ? "Signing in..." : "Sign In"}
				</button>
                <p className="text-center text-sm text-gray-400 mt-4">
                    Don't have an account? <Link href="/register" className="text-brand-lightblue hover:text-brand-lightmuted font-medium transition-colors">Register here</Link>
                </p>
			</form>
		</div>
	);
}
