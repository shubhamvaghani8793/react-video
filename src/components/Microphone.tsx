    import React, { useState, useEffect } from 'react';

    function MicrophoneComponent() {
      const [microphoneAccess, setMicrophoneAccess] = useState(false);
      const [stream, setStream] = useState(null);

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

        // Cleanup function to stop the stream when the component unmounts
        return () => {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        };
      }, [stream]); // Dependency array includes stream to ensure cleanup runs correctly

      return (
        <div>
          {microphoneAccess ? (
            <p>Microphone is active.</p>
          ) : (
            <p>Waiting for microphone access...</p>
          )}
          {/* You can add UI elements here to interact with the audio stream */}
        </div>
      );
    }

    export default MicrophoneComponent;