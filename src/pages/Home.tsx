import { useEffect, useRef, useState } from 'react';

type SpeechRecognitionEvent = Event & {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionResultList = {
  [index: number]: SpeechRecognitionResult;
  length: number;
};

type SpeechRecognitionResult = {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
};

type SpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

const CameraWithSubtitles = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // ✅ Start video
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError('Camera or microphone access denied.');
      }
    };

    startCamera();

    // ✅ Start speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setTranscript((prev) => prev + ' ' + result[0].transcript);
        } else {
          interimTranscript += result[0].transcript;
        }
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', e);
      setError('Speech recognition failed.');
    };

    recognition.start();

    return () => {
      recognition.stop();
      const tracks = (videoRef.current?.srcObject as MediaStream)
        ?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="300" muted />
      <div style={{
        marginTop: '1rem',
        background: '#000',
        color: '#0f0',
        padding: '10px',
        fontFamily: 'monospace',
        minHeight: '40px'
      }}>
        {transcript || '🎤 Speak to see subtitles...'}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CameraWithSubtitles;
