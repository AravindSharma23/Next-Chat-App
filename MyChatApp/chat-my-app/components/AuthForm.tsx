"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/authSlice";
import { AppDispatch } from "@/redux/store";

export default function AuthForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("aravind@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);
      setError("");

      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const payload =
        mode === "login"
          ? { email, password }
          : { name, email, password, birthday };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );
    } catch {
      setError("Unable to connect. Please check server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="glass-card w-full max-w-md rounded-[2rem] p-7">
        <h1 className="text-center text-4xl font-black">
          Chat<span className="gradient-text">Verse</span>
        </h1>

        <p className="mt-2 text-center text-white/60">
          {mode === "login"
            ? "Login to continue your conversations"
            : "Create your futuristic chat profile"}
        </p>

        <div className="mt-7 space-y-4">
          {mode === "register" && (
            <>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="date"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </>
          )}

          <input
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-2xl bg-violet-500 py-3 font-bold transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>

          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-sm text-white/60 hover:text-white"
          >
            {mode === "login"
              ? "New user? Create account"
              : "Already have account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}