"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setError("");

    const client = getSupabaseClient();
    if (!client) {
      setError("Auth is not configured yet. Add your Supabase credentials.");
      setStatus("error");
      return;
    }
    const { error: authError } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div
      className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,76,61,0.08) 0%, transparent 70%)",
      }}
    >
      <div
        className="w-full max-w-sm rounded-xl px-8 py-10"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className="display-font text-2xl tracking-wider"
              style={{ color: "var(--text)" }}
            >
              NATIONAL
            </span>
            <span
              className="display-font text-2xl tracking-wider"
              style={{ color: "var(--accent)" }}
            >
              PULSE
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Sign in to access your dashboard
          </p>
        </div>

        {status === "sent" ? (
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              <span style={{ color: "var(--accent3)", fontSize: "20px" }}>
                &#10003;
              </span>
            </div>
            <p
              className="text-sm font-semibold mb-2"
              style={{ color: "var(--text)" }}
            >
              Check your email
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              We sent a magic link to{" "}
              <span style={{ color: "var(--text)" }}>{email}</span>. Click it to
              sign in — no password needed.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm underline underline-offset-4"
              style={{ color: "var(--muted)" }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs mono uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campaign.com"
                required
                className="w-full rounded px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: "var(--accent)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-2.5 rounded text-sm font-semibold transition-opacity"
              style={{
                background: "var(--accent)",
                color: "white",
                opacity: status === "loading" ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "Sending..." : "Send Magic Link"}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
              No password required. We will email you a sign-in link.
            </p>
          </form>
        )}

        <div
          className="mt-8 pt-6 text-center"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/pricing"
              className="underline underline-offset-4"
              style={{ color: "var(--text)" }}
            >
              View pricing
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
