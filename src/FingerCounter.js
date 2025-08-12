import React, { useEffect, useRef } from 'react';
import './FingerCounter.css';

export default function FingerCounter({ onFingerCount }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const hands = new window.Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(onResults);

    handsRef.current = hands;

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
    cameraRef.current = camera;

    return () => {
      camera.stop();
    };
  }, []);

  function onResults(results) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      drawLandmarks(ctx, landmarks);
      const count = countFingers(landmarks);
      onFingerCount(count);
    } else {
      onFingerCount(0);
    }

    ctx.restore();
  }

  function drawLandmarks(ctx, landmarks) {
    ctx.fillStyle = 'red';
    for (let i = 0; i < landmarks.length; i++) {
      const x = landmarks[i].x * ctx.canvas.width;
      const y = landmarks[i].y * ctx.canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // Count fingers raised (thumb + 4 fingers)
  function countFingers(landmarks) {
    let count = 0;

    // Thumb: Compare tip (4) and IP joint (3) x coordinate (simplified)
    if (landmarks[4].x < landmarks[3].x) count++;

    // Fingers: tip (8, 12, 16, 20) above pip (6, 10, 14, 18) y coordinate means raised
    const tips = [8, 12, 16, 20];
    const pips = [6, 10, 14, 18];
    for (let i = 0; i < tips.length; i++) {
      if (landmarks[tips[i]].y < landmarks[pips[i]].y) count++;
    }
    return count;
  }

  return (
    <div className="fingercounter-container">
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        width="640"
        height="480"
        playsInline
      ></video>
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        className="output_canvas"
      ></canvas>
    </div>
  );
}
