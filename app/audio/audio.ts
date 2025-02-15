// app/audio/api/audio.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get('audio');

  if (audioFile instanceof File) {
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // You may save the audio file temporarily if needed
    const filePath = path.join(process.cwd(), 'public', 'uploads', audioFile.name);
    fs.writeFileSync(filePath, buffer);

    // Sending audio data to ElevenLabs for transcription
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/speech/to-text', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`, // Set your API key here
          'Content-Type': 'application/octet-stream',
        },
        body: buffer,
      });

      const data = await response.json();

      if (response.ok) {
        const transcription = data.transcription; // Access the transcription from the response
        return NextResponse.json({ message: 'Audio processed!', transcription });
      } else {
        return NextResponse.json({ message: 'Error processing audio.', error: data }, { status: 500 });
      }
    } catch (error) {
      console.error('Error sending audio to ElevenLabs:', error);
      return NextResponse.json({ message: 'Internal Error.', error }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Audio file not received.' }, { status: 400 });
}