// app/audio/api/audio.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Process the incoming audio data here
    const body = await request.json();
  console.log(body); // Log or process the audio data as needed

    return NextResponse.json({ message: 'Audio received!' });
}