import { useState, useEffect } from 'react';

function MicrophoneComponent() {
  const [microphoneAccess, setMicrophoneAccess] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const requestMicrophoneAccess = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(mediaStream);
        setMicrophoneAccess(true);
        console.log("Microphone access granted.");
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setMicrophoneAccess(false);
        alert("Microphone access denied. Please enable it in your browser settings.");
      }
    };

    requestMicrophoneAccess();

    return () => {
      // Cleanup mic stream on unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // ✅ empty dependency array ensures effect runs only once

  return (
    <div>
      {microphoneAccess ? (
        <p>🎤 Microphone is active.</p>
      ) : (
        <p>⏳ Waiting for microphone access...</p>
      )}
    </div>
  );
}

export default MicrophoneComponent;
