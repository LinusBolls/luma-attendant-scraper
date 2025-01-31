"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('lumaAuthToken');
    if (authToken) {
      router.push('/dashboard');
    }
  }, [router]);

  const requestCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch("/api/luma/auth/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      setCodeSent(true);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const verifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code) return;

    try {
      const res = await fetch("/api/luma/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const { authToken } = await res.json();
      localStorage.setItem("lumaAuthToken", authToken);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-dvh p-4 gap-4 flex flex-col items-center justify-center">
      <Logo />

      {!codeSent ? (
        <form onSubmit={requestCode} className="w-full max-w-md">
          <Input
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            required
            onSubmit={requestCode}
          />
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </form>
      ) : (
        <form onSubmit={verifyCode} className="w-full max-w-md">
          <Input
            type="text"
            value={code}
            onChange={setCode}
            placeholder="Enter verification code"
            required
            onSubmit={verifyCode}
          />
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
}
