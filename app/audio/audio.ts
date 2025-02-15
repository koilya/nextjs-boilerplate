// app/audio/api/audio.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SpeechClient } from '@google-cloud/speech';
import { Configuration, OpenAIApi } from 'openai';

// Create Google Cloud Speech client
const client = new SpeechClient();

// Create OpenAI client
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get('audio');

  if (audioFile instanceof File) {
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // You may save the audio file temporarily if needed
    const filePath = path.join(process.cwd(), 'public', 'uploads', audioFile.name);
    fs.writeFileSync(filePath, buffer);

    // Step 1: Use Google Cloud Speech-to-Text to transcribe the audio
    try {
      const [response] = await client.recognize({
        audio: {
          content: buffer.toString('base64'),
        },
        config: {
          encoding: 'LINEAR16', // Adjust based on your audio format
          sampleRateHertz: 16000, // Adjust based on your audio sample rate
          languageCode: 'en-US', // Adjust based on your preferred language
        },
      });

      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      // Step 2: Send the transcription to OpenAI API for analysis
      const aiResponse = await openai.createCompletion({
        model: 'text-davinci-003', // Adjust the model as per your need
        prompt: `Please analyze and summarize the following text:\n\n${transcription}`,
        max_tokens: 150, // Limit the response length
      });

      const analysisResult = aiResponse.data.choices[0].text.trim();

      // Step 3: Return the transcription and AI response
      return NextResponse.json({ 
        message: 'Audio processed successfully!', 
        transcription, 
        analysis: analysisResult 
      });
    } catch (error) {
      console.error('Error processing audio with Google Cloud:', error);
      return NextResponse.json({ message: 'Error processing audio.', error }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Audio file not received.' }, { status: 400 });
}