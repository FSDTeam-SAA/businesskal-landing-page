// Isolated HTTP fixture: never connects to MongoDB or sends email/notifications.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const users = new Map();
const tokens = new Map();
let sequence = 0;
function issue(user) {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, sub: user._id, sequence: ++sequence })).toString("base64url");
  const accessToken = `header.${payload}.access`;
  const refreshToken = `header.${payload}.refresh`;
  tokens.set(accessToken, user); tokens.set(refreshToken, user);
  return { ...user, accessToken, refreshToken };
}
const fixture = createServer(async (req, res) => {
  let body = "";
  for await (const chunk of req) body += chunk;
  let data = {};
  try { if (body) data = JSON.parse(body); } catch { res.writeHead(400).end(); return; }
  const user = tokens.get(req.headers.authorization?.replace("Bearer ", ""));
  const send = (status, result) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(result)); };
  const okay = (value, message = "Success", status = 200) => send(status, { success: true, data: value, message });
  const fail = (status, message) => send(status, { success: false, message });
  switch (req.url) {
    case "/api/v1/auth/register": {
      if (users.has(data.email)) return fail(409, "Email already registered");
      const account = { ...data, _id: String(users.size + 1), vendorStatus: "pending", internalSecret: "must-not-be-public" };
      users.set(data.email, account);
      return okay(null, data.role === "seller" ? "Seller registration submitted. Please wait for admin approval." : "Account created. You can now sign in.", 201);
    }
    case "/api/v1/auth/login": {
      const account = users.get(data.email);
      if (!account || account.password !== data.password) return fail(401, "Invalid email or password");
      if (account.role === "seller" && account.vendorStatus !== "approved") return fail(403, "Please wait for admin approval.");
      return okay(issue(account), "Signed in");
    }
    case "/api/v1/user/profile": return user ? okay(user) : fail(401, "Session expired");
    case "/api/v1/auth/refresh-token": {
      const account = tokens.get(data.refreshToken);
      if (!account || (account.role === "seller" && account.vendorStatus !== "approved")) return fail(401, "Invalid refresh token");
      return okay(issue(account));
    }
    case "/api/v1/user/become-seller": {
      if (!user) return fail(401, "Sign in first");
      if (user.role !== "user") return fail(409, "Application already submitted");
      Object.assign(user, data, { role: "seller", vendorStatus: "pending" });
      for (const [key, value] of tokens) if (value === user) tokens.delete(key);
      return okay({ role: "seller", vendorStatus: "pending" }, "Seller application submitted. Please wait for admin approval.");
    }
    case "/api/v1/auth/logout": {
      if (user) for (const [key, value] of tokens) if (value === user) tokens.delete(key);
      return okay(null);
    }
    case "/api/v1/auth/forget": return okay(null, "Reset code sent");
    case "/api/v1/auth/reset-password": return okay(null, "Password reset successfully");
    case "/api/v1/landing/catalogue": return okay({ listings: [], suppliers: [] });
    default: return fail(404, "Not found");
  }
});
await new Promise((resolve) => fixture.listen(0, "127.0.0.1", resolve));
const portProbe = createServer();
await new Promise((resolve) => portProbe.listen(0, "127.0.0.1", resolve));
const port = portProbe.address().port;
await new Promise((resolve) => portProbe.close(resolve));
const origin = `http://localhost:${port}`;
const child = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "start", "--port", String(port)], {
  cwd: root, env: { ...process.env, BACKEND_API_URL: `http://127.0.0.1:${fixture.address().port}/api/v1` }, stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
});
let startupError = "";
child.stderr.on("data", (chunk) => { startupError += chunk.toString(); });
child.stdout.resume();
const stop = () => { child.kill(); fixture.close(); };
process.on("SIGINT", () => { stop(); process.exit(0); });
process.on("SIGTERM", () => { stop(); process.exit(0); });
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(startupError || "Next.js exited");
    try { ready = (await fetch(origin)).ok; if (ready) break; } catch { /* starting */ }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert.ok(ready, "Production server must start");
  const jar = new Map();
  async function request(action, data, method = "POST", extra = {}) {
    const response = await fetch(`${origin}/api/account/${action}`, { method,
      headers: { Origin: origin, "Content-Type": "application/json", Cookie: [...jar].map(([key, value]) => `${key}=${value}`).join("; "), ...extra },
      ...(method === "POST" ? { body: JSON.stringify(data || {}) } : {}),
    });
    for (const cookie of response.headers.getSetCookie()) {
      const [name, ...parts] = cookie.split(";")[0].split("=");
      if (parts.join("=")) jar.set(name, parts.join("=")); else jar.delete(name);
    }
    return { response, result: await response.json() };
  }
  const buyer = { name: "Fixture Buyer", email: "buyer@example.com", password: "password123", role: "user" };
  const business = { storeName: "Fixture Business", country: "Bangladesh", phone: "+880123456789", storeDescription: "Products and services" };
  assert.equal((await request("register", buyer)).response.status, 201);
  assert.equal((await request("register", { ...buyer, ...business, email: "seller@example.com", role: "seller" })).response.status, 201);
  assert.equal((await request("login", { email: "seller@example.com", password: buyer.password })).response.status, 403);
  assert.equal((await request("login", { email: buyer.email, password: "wrong" })).response.status, 401);
  const login = await request("login", buyer);
  assert.equal(login.response.status, 200);
  assert.ok(login.response.headers.getSetCookie().every((cookie) => /HttpOnly/i.test(cookie) && /SameSite=lax/i.test(cookie)));
  assert.equal(JSON.stringify(login.result).includes("accessToken"), false);
  assert.equal(JSON.stringify(login.result).includes("internalSecret"), false);
  assert.equal((await request("session", null, "GET")).result.data.role, "user");
  jar.set("busineskal_access", "expired-access");
  assert.equal((await request("session", null, "GET")).response.status, 200);
  assert.notEqual(jar.get("busineskal_access"), "expired-access");
  assert.equal((await request("become-seller", business, "POST", { Origin: "https://other.example" })).response.status, 403);
  assert.equal((await request("become-seller", business)).response.status, 200);
  assert.equal(jar.size, 0);
  assert.equal((await request("session", null, "GET")).response.status, 401);
  users.get("seller@example.com").vendorStatus = "approved";
  assert.equal((await request("login", { email: "seller@example.com", password: buyer.password })).response.status, 200);
  jar.set("busineskal_access", "expired-access");
  assert.equal((await request("logout")).response.status, 200);
  assert.equal(jar.size, 0);
  assert.equal((await request("forgot", { email: buyer.email })).response.status, 200);
  assert.equal((await request("reset", { email: buyer.email, otp: "123456", password: "newpassword123", confirmPassword: "newpassword123" })).response.status, 200);
  assert.equal((await request("unknown")).response.status, 404);
  console.log("Account HTTP smoke checks passed: signup, approval errors, login, HttpOnly cookies, session refresh, seller conversion, CSRF rejection, logout, and reset.");
  if (process.argv.includes("--preview")) {
    users.clear(); tokens.clear();
    users.set(buyer.email, { ...buyer, _id: "fixture-buyer", vendorStatus: "pending" });
    users.set("seller@example.com", { ...buyer, ...business, email: "seller@example.com", _id: "fixture-seller", role: "seller", vendorStatus: "approved" });
    console.log(`Isolated browser preview: ${origin}`);
    await new Promise(() => {});
  }
} finally { stop(); }
