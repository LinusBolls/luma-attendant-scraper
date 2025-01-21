"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";

export default function Home() {
  const [eventUrl, setEventUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formatUrl = (url: string): string => {
    let formattedUrl = url.trim();
    
    // If it's just the path, add the full URL
    if (formattedUrl.startsWith('lu.ma/') || !formattedUrl.includes('lu.ma/')) {
      formattedUrl = formattedUrl.replace('lu.ma/', '');
      formattedUrl = `https://lu.ma/${formattedUrl}`;
    }
    
    // If it's missing https://, add it
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    return formattedUrl;
  };

  const validateUrl = (url: string): boolean => {
    return url.includes('lu.ma/');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!eventUrl) return;

    if (!validateUrl(eventUrl)) {
      setError("Please enter a valid lu.ma event URL");
      return;
    }
    
    const formattedUrl = formatUrl(eventUrl);
    const encodedUrl = encodeURIComponent(formattedUrl);
    setError(null);
    router.push(`/event?url=${encodedUrl}`);
  };

  return (
    <div className="min-h-dvh p-4 gap-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">whojoins.me</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Input
          value={eventUrl}
          onChange={setEventUrl}
          placeholder="URL of your event"
          onSubmit={handleSubmit}
        />
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </form>
    </div>
  );
}

// Test event URL: https://lu.ma/bkevcvsk