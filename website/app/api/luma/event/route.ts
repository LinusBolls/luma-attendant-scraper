import { LumaEventService } from '@/lib/Luma/LumaEventService';
import { LumaEvent } from '@/lib/Luma/Types';
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

    const eventDetails: LumaEvent = await new LumaEventService(authToken).getEvent(eventUrl);
    return NextResponse.json(eventDetails);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 