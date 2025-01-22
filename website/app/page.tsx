"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('lumaAuthToken');
    router.push(authToken ? '/dashboard' : '/login');
  }, [router]);

  return null; // No UI needed as we're redirecting
}

// Test event URL: https://lu.ma/bkevcvsk