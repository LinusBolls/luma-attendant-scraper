"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { LumaEvent, LumaGuest } from '@/lib/Luma/Types';
import { motion, AnimatePresence } from "motion/react"

function EventPageContent() {
  const [eventDetails, setEventDetails] = useState<LumaEvent | null>(null);
  const [guests, setGuests] = useState<LumaGuest[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const eventUrl = searchParams.get('url');

  useEffect(() => {
    const authToken = localStorage.getItem('lumaAuthToken');

    // Redirect if no auth token
    if (!authToken) {
      router.push('/login');
      return;
    }

    // Redirect if no event URL
    if (!eventUrl) {
      router.push('/');
      return;
    }

    const fetchGuests = async () => {
      try {
        setError(null);

        // Get event details using the new consolidated endpoint
        const eventRes = await fetch(`/api/luma/events?url=${encodeURIComponent(eventUrl)}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!eventRes.ok) {
          const error = await eventRes.json();
          throw new Error(error.message);
        }
        const data: LumaEvent = await eventRes.json();
        setEventDetails(data);

        // Stream guests
        const guestsRes = await fetch(
          `/api/luma/guests/all?eventId=${data.eventId}&ticketKey=${data.ticketKey}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!guestsRes.ok) {
          const error = await guestsRes.json();
          throw new Error(error.message);
        }

        const reader = guestsRes.body?.getReader();
        if (!reader) throw new Error('No reader available');

        const decoder = new TextDecoder();
        const guestList: LumaGuest[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(Boolean);
          
          for (const line of lines) {
            const guest = JSON.parse(line);
            guestList.splice(0, 0, guest);
            setGuests([...guestList]); // Update state with each new guest
          }
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchGuests();
  }, [eventUrl, router]);

  return (
    <div className="min-h-dvh p-4">
      <div className="flex flex-col gap-2 pb-4">
        <h1 className="text-2xl font-bold">{eventDetails?.eventName}</h1>
        <p className="text-sm text-gray-500">{guests.length}  Members</p>
      </div>

      {error && (
        <div className="mb-8 text-red-500">
          {error}
        </div>
      )}

      {guests.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {guests.map((guest) => (
              <motion.div 
                key={guest.api_id}
                layoutId={guest.api_id}
                layout
                initial={{ opacity: 0, backgroundColor: 'blue' }}
                animate={{ opacity: 1, backgroundColor: 'transparent' }}
                transition={{
                  layout: { duration: 0.3 },
                  opacity: { delay: 0.3, duration: 0.5 },
                  backgroundColor: { delay: 0.3, duration: 0.5 },
                }}
              >
                <UserCard user={guest} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function EventPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventPageContent />
    </Suspense>
  );
}

function UserCard({ user }: { user: LumaGuest }) {
  const UserAvatar = user.avatar_url ? (
    <Image src={user.avatar_url} width={56} height={56} alt={user.name} className="w-full h-auto rounded-full aspect-square object-cover" />
  ) : (
    <div className="w-full h-auto bg-gray-200 rounded-full aspect-square object-cover"></div>
  );

  return (
    <div key={user.api_id}>
      <div className="flex gap-4">
        <div className="w-14 h-14">{UserAvatar}</div>
        <div className="flex flex-col">
          <div className="font-medium">{user.name}</div>
          <div className="flex gap-3">
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Website
              </a>
            )}
            {user.linkedin_handle && (
              <a
                href={`https://linkedin.com${user.linkedin_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Test event URL: https://lu.ma/bkevcvsk
