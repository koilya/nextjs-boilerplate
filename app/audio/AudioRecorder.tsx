// app/audio/AudioRecorder.tsx
"use client";
import React, { useState, useEffect } from 'react';

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    useEffect(() => {
    const initMediaRecorder = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
        const audioBlob = event.data;
        // You can handle the audioBlob here (e.g., send to backend)
        console.log('Audio data available', audioBlob);
        };

    setMediaRecorder(recorder);
    };

    initMediaRecorder();
    }, []);

    const startRecording = () => {
    if (mediaRecorder) {
        mediaRecorder.start();
        setRecording(true);
    }
    };

    const stopRecording = () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
        setRecording(false);
    }
};

    return (
    <div>
        <button onClick={startRecording} disabled={recording}>
        Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
    </button>
    </div>
    );
};

export default AudioRecorder;