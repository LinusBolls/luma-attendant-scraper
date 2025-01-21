"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const requestCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/luma/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const verifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/luma/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const { authToken } = await res.json();
      localStorage.setItem("lumaAuthToken", authToken);
      router.back();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-dvh p-4 gap-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">whojoins.me</h1>

      {!codeSent ? (

        <form onSubmit={requestCode} className="w-full max-w-md">
          <Input
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
        required
      />
      {error && <p>{error}</p>}
    </form>

  ) : (

    <form onSubmit={verifyCode} className="w-full max-w-md">
      <Input
        type="text"
        value={code}
        onChange={setCode}
        placeholder="Enter verification code"
        required
      />
        {error && <p>{error}</p>}
      </form>
    )}
    </div>
    
  );
}
