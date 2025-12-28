import { useState, useEffect, useRef } from 'react';

interface AudioAnalysis {
  isListening: boolean;
  volume: number;
  getFrequencyData: () => Uint8Array;
  startListening: () => Promise<void>;
  stopListening: () => void;
  error: string | null;
}

export const useAudioAnalysis = (fftSize: number = 256): AudioAnalysis => {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs for Audio Context, Analyser, and Animation Frame
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array>(new Uint8Array(fftSize / 2));

  const startListening = async () => {
    try {
      setError(null);

      // Request Microphone Access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize Audio Context
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      // Create Analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyserRef.current = analyser;

      // Connect Stream to Analyser
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      // Initialize buffer for data
      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      setIsListening(true);
      analyzeLoop();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(
        'Could not access microphone. Please ensure permissions are granted.'
      );
      setIsListening(false);
    }
  };

  const analyzeLoop = () => {
    if (!analyserRef.current) return;

    // Get Frequency Data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);

    // Calculate Average Volume (Simple RMS-ish approximation)
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += dataArrayRef.current[i];
    }
    const avg = sum / dataArrayRef.current.length;
    setVolume(avg); // Normalized 0-255 roughly

    // Recursive call
    rafRef.current = requestAnimationFrame(analyzeLoop);
  };

  const stopListening = () => {
    setIsListening(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Close Context and Tracks to release mic
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current.mediaStream
        .getTracks()
        .forEach((track) => track.stop());
      sourceRef.current = null;
    }
    setVolume(0);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // Expose a getter for the raw data to avoid "ref access during render" lint issues
  // Consumers call this inside their own animation loop.
  const getFrequencyData = () => dataArrayRef.current;

  return {
    isListening,
    volume,
    getFrequencyData,
    startListening,
    stopListening,
    error,
  };
};
