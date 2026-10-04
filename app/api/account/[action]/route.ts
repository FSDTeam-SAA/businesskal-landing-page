import { AccountError, authenticatedAccount, backendAccount, clearSession, logoutAccount, publicAccount, saveSession } from "../../../lib/account";

function failure(error: unknown) {
  return Response.json({ success: false, message: error instanceof AccountError ? error.message : "Please try again later." },
    { status: error instanceof AccountError ? error.status : 500, headers: { "Cache-Control": "no-store" } });
}

export async function GET(_request: Request, context: RouteContext<"/api/account/[action]">) {
  const { action } = await context.params;
  if (action !== "session") return Response.json({ success: false }, { status: 404 });
  try {
    const result = await authenticatedAccount("/user/profile");
    return Response.json({ success: true, data: publicAccount(result.data) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request, context: RouteContext<"/api/account/[action]">) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  }
  const { action } = await context.params;
  try {
    if (action === "logout") {
      try { await logoutAccount(); } catch { /* Local cookies are always cleared. */ }
      return Response.json({ success: true });
    }
    const body = await request.json().catch(() => { throw new AccountError(400, "Invalid form data."); });
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new AccountError(400, "Invalid form data.");
    const fields: Record<string, string[]> = {
      login: ["email", "password"],
      register: ["name", "email", "password", "role", "storeName", "country", "phone", "storeDescription"],
      "become-seller": ["storeName", "country", "phone", "storeDescription"],
      forgot: ["email"], reset: ["email", "otp", "password", "confirmPassword"],
    };
    if (!fields[action]) throw new AccountError(404, "Account action not found.");
    const payload = Object.fromEntries(fields[action].filter((key) => body[key] !== undefined).map((key) => {
      if (typeof body[key] !== "string" || body[key].length > 1000) throw new AccountError(400, "Please check your form details.");
      return [key, body[key]];
    }));
    if (action === "become-seller") {
      const result = await authenticatedAccount("/user/become-seller", "POST", payload);
      await clearSession();
      return Response.json({ success: true, message: result.message, data: result.data });
    }
    const paths: Record<string, string> = { login: "/auth/login", register: "/auth/register", forgot: "/auth/forget", reset: "/auth/reset-password" };
    const result = await backendAccount(paths[action], "POST", payload);
    if (action === "login") {
      await saveSession(result.data);
      return Response.json({ success: true, message: result.message, data: publicAccount(result.data) });
    }
    return Response.json({ success: true, message: result.message }, { status: action === "register" ? 201 : 200 });
  } catch (error) { return failure(error); }
}
