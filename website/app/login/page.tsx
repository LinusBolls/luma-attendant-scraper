"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch("https://luma.bolls.dev/api/v1/request-luma-otp", {
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send code");
      
      setIsCodeSent(true);
    } catch (err) {
      setError("Failed to send verification code");
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://luma.bolls.dev/api/v1/login-with-luma-otp", {
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) throw new Error("Invalid code");
      
      const data = await response.json();
      localStorage.setItem('authToken', data.data.authToken);
      router.push("/");
    } catch (err) {
      setError("Invalid verification code");
    }
  };

  return (
    <div className="min-h-dvh p-4 gap-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Lumy</h1>

      {!isCodeSent ? (
        <form onSubmit={requestOTP} className="w-full max-w-md">
          <Input
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
        required
      />
    </form>
  ) : (
    <form onSubmit={verifyOTP} className="w-full max-w-md">
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
