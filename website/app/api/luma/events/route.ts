import { LumaEventService } from '@/lib/Luma/LumaEventService';
import { LumaEvent } from '@/lib/Luma/Types';
import { NextResponse } from 'next/server';

type Period = 'future' | 'past';

// Validate and extract auth token
function getAuthToken(request: Request): string | null {
  return request.headers.get('Authorization')?.replace('Bearer ', '') || null;
}

// Validate period parameter
function validatePeriod(period: string | null): period is Period {
  return period === 'future' || period === 'past';
}

// GET /api/luma/events - List events
// GET /api/luma/events?url={eventUrl} - Get single event
export async function GET(request: Request) {
  try {
    const authToken = getAuthToken(request);
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventUrl = searchParams.get('url');

    // If eventUrl is provided, return single event details
    if (eventUrl) {
      const eventDetails: LumaEvent = await new LumaEventService(authToken).getEvent(eventUrl);
      return NextResponse.json(eventDetails);
    }

    // Otherwise, return list of events
    const period = searchParams.get('period');
    const limit = parseInt(searchParams.get('limit') || '25');

    if (!validatePeriod(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be "future" or "past"' },
        { status: 400 }
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be between 1 and 100' },
        { status: 400 }
      );
    }

    const eventService = new LumaEventService(authToken);
    const events = await eventService.getUserEvents(period, limit);
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 