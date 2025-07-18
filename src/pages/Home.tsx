import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [hasError, setHasError] = useState(false);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log('Captured image:', imageSrc);
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error("Camera access error:", error);
    setHasError(true);
  };

  return (
    <div>
      {hasError ? (
        <p style={{ color: 'red' }}>
          🚫 Camera not detected or permission denied. Please check your settings.
        </p>
      ) : (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            onUserMediaError={handleUserMediaError}
          />
          <button onClick={capture}>Capture</button>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
