'use client';

import React, { useEffect, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface SpeechToTextProps {
  onTranscriptUpdate?: (text: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscriptUpdate }) => {
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
    error,
  } = useSpeechRecognition();

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Notify parent of updates (debounced slightly or just passed through)
    // We pass the full transcript + interim for real-time feel,
    // OR just the final transcript chunks.
    // For this player, let's pass the stable transcript to avoid rapid flickering of GIFs
    if (onTranscriptUpdate && transcript) {
      onTranscriptUpdate(transcript);
    }
  }, [transcript, interimTranscript, onTranscriptUpdate]);

  if (!isSupported) {
    return (
      <Card role="alert" className="error-card">
        <h3>Feature Not Supported</h3>
        <p>
          Your browser does not support Speech Recognition. Please use Chrome or
          Safari.
        </p>
      </Card>
    );
  }

  return (
    <div className="stt-container">
      <div
        style={{
          marginBottom: 'var(--spacing-md)',
          display: 'flex',
          gap: 'var(--spacing-sm)',
        }}
      >
        {!isListening ? (
          <Button
            onClick={startListening}
            aria-label="Start Live Transcription"
          >
            Start Listening
          </Button>
        ) : (
          <Button
            onClick={stopListening}
            variant="secondary"
            aria-label="Stop Live Transcription"
          >
            Stop Listening
          </Button>
        )}
        <Button onClick={clearTranscript} variant="ghost">
          Clear
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          style={{ color: 'red', marginBottom: 'var(--spacing-sm)' }}
        >
          {error}
        </div>
      )}

      <Card role="log" aria-live="polite" className="transcript-box" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            fontSize: '1.5rem', // Large font for readability
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
          }}
        >
          {transcript}
          {interimTranscript && (
            <span
              style={{
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
              }}
            >
              {interimTranscript}
            </span>
          )}
          {/* Scroll anchor */}
          <div ref={transcriptEndRef} />
        </div>
        {!transcript && !interimTranscript && (
          <p
            style={{
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              marginTop: 'var(--spacing-lg)',
            }}
          >
            Press &quot;Start Listening&quot; and speak into your microphone...
          </p>
        )}
      </Card>
    </div>
  );
};

export default SpeechToText;
