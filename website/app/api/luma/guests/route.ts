import { LumaEventService } from '@/lib/Luma/LumaEventService';
import { GetLumaGuestsResponse } from '@/lib/Luma/Types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const ticketKey = searchParams.get('ticketKey');
    const cursor = searchParams.get('cursor');
    const authToken = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!eventId || !ticketKey) {
      return NextResponse.json(
        { error: 'Event ID and ticket key are required' },
        { status: 400 }
      );
    }
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const guests: GetLumaGuestsResponse = await new LumaEventService(authToken).getGuests(eventId, ticketKey, cursor);
    return NextResponse.json(guests);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}