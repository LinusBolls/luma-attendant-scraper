import { LumaClient, LumaEvent } from '@/lib/luma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventUrl = searchParams.get('url');
    const authToken = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!eventUrl) {
      return NextResponse.json({ error: 'Event URL is required' }, { status: 400 });
    }
    if (!authToken) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const client = new LumaClient(authToken);
    const eventDetails: LumaEvent = await client.event.getEvent(eventUrl);
    return NextResponse.json(eventDetails);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 