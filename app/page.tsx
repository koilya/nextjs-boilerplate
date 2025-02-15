import Image from 'next/image';
import React from 'react';
import AudioRecorder from './audio/AudioRecorder'; // Assuming this exists
import { Conversation } from './audio/Conversation'; // Import the Conversation component

export default function Home() {
  return (
        {/* Include the AudioRecorder component */}
        <AudioRecorder />
        
        {/* Include the Conversation component */}
        <Conversation />

        {/* Other components or content */}
      </main>
    </div>
  );
}