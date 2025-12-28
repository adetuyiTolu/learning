'use client';

import React, { useState } from 'react';
import SpeechToText from '@/components/SpeechToText';
import SignLanguagePlayer from '@/components/SignLanguagePlayer';

export default function TranscribePage() {
  const [transcript, setTranscript] = useState('');

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Live Accessibility Tools
      </h1>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'stretch', minHeight: '600px' }}>
        {/* Left Column: Speech to Text */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', height: '2rem' }}>
            Speech Recognition
          </h2>
          <div style={{ flex: 1 }}>
            <SpeechToText onTranscriptUpdate={setTranscript} />
          </div>
        </div>

        {/* Right Column: Sign Language Interpreter */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', height: '2rem' }}>
            Sign Language Interpretation
          </h2>
          <div style={{ flex: 1 }}>
            <SignLanguagePlayer text={transcript} />
          </div>
        </div>
      </div>
    </div>
  );
}
