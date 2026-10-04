import { cookies } from "next/headers";

export type Account = { _id: string; name: string; email: string; role: "user" | "seller" | "admin"; vendorStatus?: string; storeName?: string; country?: string };
export class AccountError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function publicAccount(user: Account): Account {
  return { _id: user._id, name: user.name, email: user.email, role: user.role,
    vendorStatus: user.vendorStatus, storeName: user.storeName, country: user.country };
}

export async function backendAccount(path: string, method = "GET", body?: unknown, token?: string) {
  const base = process.env.BACKEND_API_URL;
  if (!base) throw new AccountError(503, "Accounts are temporarily unavailable. Please try again later.");
  let response;
  try {
    response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
      method, cache: "no-store", signal: AbortSignal.timeout(10000),
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch { throw new AccountError(502, "We could not reach the account service. Please try again."); }
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success !== true) {
    const status = response.status >= 400 && response.status < 500 ? response.status : 502;
    throw new AccountError(status, status === 502 ? "The account service is temporarily unavailable." : result?.message || "Please check your details and try again.");
  }
  return result;
}

const accessCookie = "busineskal_access";
const refreshCookie = "busineskal_refresh";
export async function saveSession(data: { accessToken: string; refreshToken: string }) {
  if (!data.accessToken || !data.refreshToken) throw new AccountError(502, "The account service returned an incomplete session.");
  const jar = await cookies();
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
  // Token claims are used only for cookie lifetime. The backend validates identity.
  const lifetime = (token: string, fallback: number) => {
    try {
      const exp = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString()).exp;
      return typeof exp === "number" ? Math.max(0, Math.floor(exp - Date.now() / 1000)) : fallback;
    } catch { return fallback; }
  };
  jar.set(accessCookie, data.accessToken, { ...options, maxAge: lifetime(data.accessToken, 3600) });
  jar.set(refreshCookie, data.refreshToken, { ...options, maxAge: lifetime(data.refreshToken, 14 * 86400) });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(accessCookie);
  jar.delete(refreshCookie);
}

export async function authenticatedAccount(path: string, method = "GET", body?: unknown) {
  const jar = await cookies();
  let access = jar.get(accessCookie)?.value;
  const refresh = jar.get(refreshCookie)?.value;
  if (access) {
    try { return await backendAccount(path, method, body, access); }
    catch (error) { if (!(error instanceof AccountError) || error.status !== 401) throw error; }
  }
  if (!refresh) throw new AccountError(401, "Please sign in to continue.");
  try {
    const renewed = await backendAccount("/auth/refresh-token", "POST", { refreshToken: refresh });
    await saveSession(renewed.data);
    access = renewed.data.accessToken;
  } catch (error) {
    if (error instanceof AccountError && [401, 403].includes(error.status)) await clearSession();
    throw error;
  }
  return backendAccount(path, method, body, access);
}

export async function logoutAccount() {
  try { await authenticatedAccount("/auth/logout", "POST", {}); }
  finally { await clearSession(); }
}
