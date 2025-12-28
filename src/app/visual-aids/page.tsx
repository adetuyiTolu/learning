import React from 'react';
import VisualAids from '@/components/VisualAids';

export default function VisualAidsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>
        Visual Learning Aids
      </h1>
      <p style={{ marginBottom: 'var(--spacing-lg)' }}>
        Tools designed to enhance learning through visual interaction and
        environmental awareness.
      </p>
      <VisualAids />
    </div>
  );
}
