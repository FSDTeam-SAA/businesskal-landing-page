"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Account } from "./lib/account";

export type AccountMode = "login" | "signup" | "seller-signup" | "become-seller" | "account" | "forgot" | "reset";

export default function AccountDialog({ initialMode, account, onAccount, close }: {
  initialMode: AccountMode; account: Account | null; onAccount: (account: Account | null) => void; close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<AccountMode>(initialMode);
  const [role, setRole] = useState(initialMode === "seller-signup" ? "seller" : "user");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [finished, setFinished] = useState(false);
  useEffect(() => { dialog.current?.showModal(); }, []);
  const signup = mode === "signup" || mode === "seller-signup";
  const business = (signup && role === "seller") || mode === "become-seller";
  function switchMode(next: AccountMode) { setMode(next); setError(""); setMessage(""); setFinished(false); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (signup || mode === "reset") {
      if (data.password !== data.confirmPassword) { setError("Passwords do not match."); return; }
    }
    if (signup) data.role = role;
    const action = signup ? "register" : mode === "become-seller" ? "become-seller" : mode;
    setPending(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/account/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Please try again.");
      if (typeof data.email === "string") setEmail(data.email);
      if (mode === "login") { onAccount(result.data); setMode("account"); }
      else if (mode === "become-seller" || (signup && role === "seller")) {
        if (mode === "become-seller") onAccount(null);
        setMessage(result.message); setFinished(true);
      } else if (mode === "forgot") { setMode("reset"); setMessage("Enter the code sent to your email and choose a new password."); }
      else { setMode("login"); setMessage(result.message); }
    } catch (cause) { setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "The request timed out. Please try again."); }
    finally { setPending(false); }
  }
  async function logout() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/account/logout", { method: "POST" });
      if (!response.ok) throw new Error("Could not sign out. Please try again.");
      onAccount(null); setMode("login"); setMessage("You have signed out.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
    finally { setPending(false); }
  }
  const title = finished ? "Your application is submitted." : mode === "account" ? "Your Busineskal account" : signup ? "Create your account" : mode === "become-seller" ? "Become a seller" : mode === "forgot" ? "Forgot your password?" : mode === "reset" ? "Choose a new password" : "Welcome back.";
  return <dialog ref={dialog} className="detail-dialog account-dialog" onCancel={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }} aria-labelledby="account-title">
    <button className="icon-button dialog-close" aria-label="Close account dialog" onClick={close}>✕</button>
    <div className="dialog-body">
      <span className="eyebrow">YOUR NEXT BUSINESS CONNECTION</span>
      <h2 id="account-title">{title}</h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}
      {finished ? <div className="interest-success"><p>Your seller account needs admin approval. You can sign in as a seller after it is approved.</p><button className="button primary" onClick={close}>Back to marketplace</button></div>
        : mode === "account" && account ? <div className="account-summary">
          <dl><div><dt>Name</dt><dd>{account.name}</dd></div><div><dt>Email</dt><dd>{account.email}</dd></div><div><dt>Account</dt><dd>{account.role === "user" ? "Buyer" : account.role === "seller" ? "Seller" : "Administrator"}</dd></div>
            {account.role === "seller" && <div><dt>Seller status</dt><dd>{account.vendorStatus || "pending"}</dd></div>}
          </dl>
          {account.role === "user" && <button className="button primary" onClick={() => switchMode("become-seller")}>Become a seller</button>}
          <button className="button secondary" disabled={pending} onClick={logout}>{pending ? "Signing out..." : "Sign out"}</button>
        </div> : <>
          <p>{signup ? "Join as a buyer to discover suppliers, or apply as a seller to showcase your business." : business ? "Tell us about your business. Your application will be reviewed by an administrator." : mode === "login" ? "Buyers and approved sellers can sign in with their email and password." : mode === "forgot" ? "We will email you a password reset code." : "Use the code from your email to reset your password."}</p>
          {signup && <div className="account-type" role="group" aria-label="Account type"><button type="button" aria-pressed={role === "user"} onClick={() => setRole("user")}>Buyer</button><button type="button" aria-pressed={role === "seller"} onClick={() => setRole("seller")}>Seller</button></div>}
          <form className="interest-form" onSubmit={submit} key={`${mode}-${role}`}>
            {signup && <label>Full name<input name="name" autoComplete="name" required maxLength={100} placeholder="Your full name" /></label>}
            {mode !== "become-seller" && <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={200} defaultValue={email} placeholder="you@business.com" /></label>}
            {mode === "reset" && <label>Email verification code<input name="otp" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6}" maxLength={6} placeholder="6-digit code" /></label>}
            {mode !== "become-seller" && mode !== "forgot" && <label>{mode === "reset" ? "New password" : "Password"}<input name="password" type="password" autoComplete={signup || mode === "reset" ? "new-password" : "current-password"} required minLength={signup || mode === "reset" ? 8 : 1} maxLength={72} placeholder={signup ? "At least 8 characters" : "Your password"} /></label>}
            {(signup || mode === "reset") && <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} maxLength={72} placeholder="Repeat your password" /></label>}
            {business && <>
              <label>Business name<input name="storeName" autoComplete="organization" required maxLength={150} placeholder="Your business name" /></label>
              <label>Country<input name="country" autoComplete="country-name" required maxLength={100} placeholder="Your business country" /></label>
              <label>Phone number<input name="phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="Include country code" /></label>
              <label>What does your business offer?<textarea name="storeDescription" maxLength={1000} rows={3} placeholder="Products, services, and your business specialty" /></label>
              <p className="fine-print">Seller accounts are reviewed before approval. Submitting this form does not automatically approve your business.</p>
            </>}
            <button className="button primary" type="submit" disabled={pending} aria-busy={pending}>{pending ? "Please wait..." : signup ? role === "seller" ? "Apply as a seller" : "Create buyer account" : mode === "become-seller" ? "Submit seller application" : mode === "forgot" ? "Send reset code" : mode === "reset" ? "Reset password" : "Sign in"}</button>
          </form>
          <div className="account-links">
            {mode === "login" && <><button onClick={() => switchMode("forgot")}>Forgot password?</button><button onClick={() => switchMode("signup")}>Create an account</button></>}
            {signup && <button onClick={() => switchMode("login")}>Already have an account? Sign in</button>}
            {(mode === "forgot" || mode === "reset") && <button onClick={() => switchMode("login")}>Back to sign in</button>}
          </div>
        </>}
    </div>
  </dialog>;
}
