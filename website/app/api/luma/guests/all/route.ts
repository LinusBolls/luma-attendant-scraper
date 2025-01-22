import { LumaEventService } from '@/lib/Luma/LumaEventService';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const ticketKey = searchParams.get('ticketKey');
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

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start streaming in the background
    (async () => {
      try {
        for await (const guest of new LumaEventService(authToken).streamGuests(eventId, ticketKey)) {
          await writer.write(encoder.encode(JSON.stringify(guest) + '\n'));
        }
      } catch (error) {
        console.error('Streaming error:', error);
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 