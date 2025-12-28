import React from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header
        style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>
          Welcome to AccessLearn
        </h1>
        <p
          style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }}
        >
          Empowering students with inclusive learning tools.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-lg)',
        }}
      >
        <Card title="Live Transcription" role="region" className="feature-card">
          <p style={{ marginBottom: 'var(--spacing-md)' }}>
            Real-time speech-to-text for lectures and conversations.
          </p>
          <Button href="/transcribe" fullWidth>
            Start Transcription
          </Button>
        </Card>

        <Card
          title="Visual Learning Aids"
          role="region"
          className="feature-card"
        >
          <p style={{ marginBottom: 'var(--spacing-md)' }}>
            Interactive visual content and cues for enhanced learning.
          </p>
          <Button href="/visual-aids" fullWidth variant="ghost">
            View Aids
          </Button>
        </Card>
      </div>
    </div>
  );
}
