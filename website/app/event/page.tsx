"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type Event = {
    name: string;
    url: string;
    attendees: Person[];
}

type Person = {
    name: string;
    tagLine?: string;
    company: string;
    position: string;
    imageUrl?: string;
};

function PersonList({ people }: { people: Person[] }) {
    return (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
                <li key={person.name}>
                    <PersonRow person={person} />
                </li>
            ))}
        </ul>
    );
}

function PersonRow({ person }: { person: Person }) {
    return (
        <div className="flex items-center gap-4">
            {person.imageUrl ? (
                <Image src={person.imageUrl} alt={person.name} width={100} height={100} className="w-16 h-16 rounded-full mr-4" />
            ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200"></div>
            )}
            <div>
                <h3 className="text-xl font-bold">{person.name}</h3>
                <div className="text-sm flex gap-1 px-3 bg-gray-400 rounded-full">
                    <span>{person.company}</span>
                    <span>•</span>
                    <span>{person.position}</span>
                </div>
                {person.tagLine && <p className="text-sm text-slate-400">{person.tagLine}</p>}
            </div>
        </div>
    );
}

const fetchPeople = async (eventUrl: string | null, router: any) => {
    if (!eventUrl) {
        router.push("/");
        return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        router.push('/login?url=' + eventUrl);
        return;
    }

    const response = await fetch("https://luma.bolls.dev/api/v1/get-event-data", {
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
        },
        method: "POST",
        body: JSON.stringify({
            authToken,
            eventUrl,
        }),
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    return data;
}

export default function EventPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const eventUrl = searchParams.get("url");
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const event = {
        name: "Test Event",
        url: "https://lu.ma/bkevcvsk",
        attendees: [],
    }


    // useEffect(() => {
    //     setLoading(true);
    //     fetchPeople(eventUrl, router).then((data) => {
    //         console.log(`Successfully fetched data: ${data}`);
    //         setPeople(data.attendees);
    //         setLoading(false);
    //     }).catch((err) => {
    //         setError("Failed to load attendees");
    //         setLoading(false);
    //     });
    // }, [eventUrl, router]);

    return (
        <div className="min-h-dvh p-4">
            <div className="mb-2 flex justify-between items-center">
                <button onClick={() => router.push("/")}>
                    <h1 className="text-2xl font-bold">Lumy</h1>
                </button>

            </div>

            <div className="outline outline-2 outline-gray-500 rounded-lg px-4 py-2">
                <div className="text-white flex justify-between">
                    <span className="font-bold">
                        {event?.name}
                    </span>
                    <span className="font-bold">
                        {event?.attendees.length}
                    </span>
                </div>
                <span className="text-gray-500">
                    {event?.url}
                </span>
            </div>


            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && <PersonList people={people} />}
        </div>
    );
}


// Test event URL: https://lu.ma/bkevcvsk