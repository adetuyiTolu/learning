'use client';

import React, { useRef, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { useAudioAnalysis } from '@/hooks/useAudioAnalysis';

const SoundVisualizer: React.FC = () => {
  const {
    isListening,
    startListening,
    stopListening,
    getFrequencyData,
    error,
  } = useAudioAnalysis();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationId: number;

    const draw = () => {
      if (!canvasRef.current || !isListening) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const data = getFrequencyData(); // Get latest data from hook getter
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / data.length) * 2.5;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * height; // Normalize 0-255 to canvas height

        // Gradient Color based on height (Green -> Yellow -> Red)
        const hue = 120 - (data[i] / 255) * 120;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationId = requestAnimationFrame(draw);
    };

    if (isListening) {
      draw();
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isListening, getFrequencyData]);

  return (
    <Card title="Real-Time Sound Visualizer" className="p-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full relative bg-black rounded-lg overflow-hidden h-64 border-2 border-gray-800">
          {!isListening && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Press Start to Visualize Audio
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={600}
            height={256}
            className="w-full h-full"
            aria-label="Sound Visualization Canvas"
            role="img"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <div className="flex gap-4">
          {!isListening ? (
            <Button onClick={startListening} size="lg">
              Start Listening
            </Button>
          ) : (
            <Button onClick={stopListening} variant="secondary" size="lg">
              Stop Listening
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          This tool uses your microphone to visualize ambient noise levels and
          frequencies in real-time. Useful for understanding sound intensity in
          your environment.
        </p>
      </div>
    </Card>
  );
};

export default SoundVisualizer;
