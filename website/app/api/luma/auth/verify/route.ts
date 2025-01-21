import { LumaClient } from '@/lib/luma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    const { authToken, data } = await LumaClient.fromEmailCode(email, code);
    return NextResponse.json({ authToken, data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 