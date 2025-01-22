"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LumaUserEvent } from '@/lib/Luma/Types';

export default function DashboardPage() {
  const [events, setEvents] = useState<LumaUserEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'future' | 'past'>('future');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('lumaAuthToken');

    if (!authToken) {
      router.push('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/luma/events?period=${activeTab}&limit=25`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }

        const data = await res.json();
        setEvents(data.entries);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router, activeTab]);

  if (loading) {
    return (
      <div className="min-h-dvh p-4 flex items-center justify-center">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh p-4">
      <div className="flex flex-col gap-2 pb-4">
        <h1 className="text-4xl font-bold">Your Events</h1>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setActiveTab('future')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              activeTab === 'future'
                ? 'bg-white text-black'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              activeTab === 'past'
                ? 'bg-white text-black'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Past Events
          </button>
        </div>
        <p className="text-sm text-gray-500">
          {events.length} {activeTab === 'future' ? 'upcoming' : 'past'} events
        </p>
      </div>

      {error && (
        <div className="mb-8 text-red-500">
          {error}
        </div>
      )}

      {events.length > 0 && (
        <div className="grid gap-6">
          {events.map((event, index) => (
            <EventCard key={event.api_id} event={event} index={index} />
          ))}
        </div>
      )}

      {events.length === 0 && !error && (
        <div className="text-center text-gray-500 mt-8">
          No {activeTab === 'future' ? 'upcoming' : 'past'} events found
        </div>
      )}
    </div>
  );
}

function EventCard({ event, index }: { event: LumaUserEvent; index: number }) {
  const formattedDate = new Date(event.event.start_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const location = event.event.geo_address_info 
    ? `${event.event.geo_address_info.city}, ${event.event.geo_address_info.country}`
    : event.event.location_type === 'online' ? 'Online' : 'Location not specified';

  return (
    <div className="bg-[#787878] rounded-xl p-4">
      <div className="flex gap-4">
        {event.event.cover_url && (
          <div className="w-32 h-32 flex-shrink-0">
            <Image 
              src={event.event.cover_url} 
              alt={event.event.name} 
              width={128} 
              height={128} 
              priority={index < 3}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium">{event.event.name}</h2>
          <p className="text-sm">{formattedDate}</p>
          <p className="text-sm">{location}</p>
          <div className="flex gap-4 mt-2">
            <div className="text-sm">
              <span className="font-medium">{event.guest_count}</span> guests
            </div>
            <div className="text-sm">
              <span className="font-medium">{event.ticket_info.spots_remaining}</span> spots left
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <a 
              href={`https://lu.ma/${event.event.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              View Event
            </a>
            <a 
              href={`/event?url=${encodeURIComponent(`https://lu.ma/${event.event.url}`)}`}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              View Guests
            </a>
          </div>
        </div>
      </div>
      {event.featured_guests.length > 0 && (
        <div className="mt-4">
          <p className="text-sm mb-2">Featured Guests:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {event.featured_guests.map((guest) => (
              <div key={guest.api_id} className="flex-shrink-0">
                <div className="w-8 h-8">
                  <Image 
                    src={guest.avatar_url} 
                    alt={guest.name} 
                    width={32} 
                    height={32} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}