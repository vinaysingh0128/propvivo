import { z } from "zod";
import { clearAccessToken, clearRefreshToken, getAccessToken, refreshAccessTokenSilently, setAccessToken, setRefreshToken } from "./tokenStorage";

const LoginResponseSchema = z.object({
	// Backend returns 'token', not 'accessToken'
	token: z.string().optional(),
	accessToken: z.string().optional(),
	refreshToken: z.string().optional(),
	user: z
		.object({
			id: z.union([z.string(), z.number()]).transform(String),
			email: z.string().optional(),
			name: z.string().optional(),
			// Backend returns firstName/lastName separately
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			role: z.string().optional(),
		})
		.optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
	// Fixed: added /api prefix to match backend route
	const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		// Backend expects { email, password } matching LoginRequest DTO
		body: JSON.stringify({ email, password }),
		credentials: "include",
	});
	if (!res.ok) {
		const message = await safeErrorMessage(res);
		throw new Error(message);
	}
	const data = await res.json();
	const parsed = LoginResponseSchema.parse(data);
	// Backend returns 'token' field, normalize to 'accessToken'
	const accessToken = parsed.token || parsed.accessToken || '';
	setAccessToken(accessToken);
	if (parsed.refreshToken) setRefreshToken(parsed.refreshToken);
	// Normalize user: combine firstName + lastName into name
	if (parsed.user) {
		const u = parsed.user as any;
		if (!u.name && (u.firstName || u.lastName)) {
			u.name = `${u.firstName || ''} ${u.lastName || ''}`.trim();
		}
	}
	// Always store token in localStorage for API calls
	if (typeof window !== 'undefined') {
		localStorage.setItem('token', accessToken);
	}
	return { ...parsed, accessToken };
}

export async function logout() {
	clearAccessToken();
	clearRefreshToken();
}

export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit, retryOn401 = true) {
	const withAuth = async (): Promise<Response> => {
		const token = getAccessToken();
		const headers = new Headers(init?.headers || {});
		if (token) headers.set("Authorization", `Bearer ${token}`);
		return fetch(input, { ...init, headers, credentials: "include" });
	};
	let res = await withAuth();
	if (res.status === 401 && retryOn401) {
		const token = await refreshAccessTokenSilently();
		if (token) {
			res = await withAuth();
		}
	}
	return res;
}

async function safeErrorMessage(res: Response): Promise<string> {
	try {
		const data = (await res.json());
		return data?.message || `Request failed with status ${res.status}`;
	} catch {
		return `Request failed with status ${res.status}`;
	}
}


