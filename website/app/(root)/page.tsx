"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";

export default function Home() {
  const [eventUrl, setEventUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventUrl) return;
    
    const encodedUrl = encodeURIComponent(eventUrl);
    router.push(`/event?url=${encodedUrl}`);
  };

  return (
    <div className="min-h-dvh p-4 gap-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Lumy</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Input
          value={eventUrl}
          onChange={setEventUrl}
          placeholder="URL of your event"
        />
      </form>
    </div>
  );
}