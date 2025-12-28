'use client';

import React, { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import SoundVisualizer from '@/components/SoundVisualizer';

// -- Sub-component: Flashcard --
interface FlashcardData {
  id: number;
  question: string;
  answer: string;
  image?: string;
}

const SAMPLE_FLASHCARDS: FlashcardData[] = [
  { id: 1, question: 'What is the capital of France?', answer: 'Paris' },
  { id: 2, question: 'What is 5 + 7?', answer: '12' },
  { id: 3, question: 'Identify this shape: ⬛', answer: 'Square' },
];

const Flashcard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = SAMPLE_FLASHCARDS[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_FLASHCARDS.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(
      (prev) => (prev - 1 + SAMPLE_FLASHCARDS.length) % SAMPLE_FLASHCARDS.length
    );
  };

  return (
    <div className="flashcard-container" style={{ textAlign: 'center' }}>
      <div
        className="flashcard"
        style={{
          height: '200px',
          perspective: '1000px',
          cursor: 'pointer',
          marginBottom: 'var(--spacing-md)',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        aria-pressed={isFlipped}
        aria-label={`Flashcard: ${isFlipped ? 'Answer' : 'Question'}. Click to flip.`}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Front */}
          <Card
            className="front"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h4 style={{ fontSize: '1.25rem' }}>{card.question}</h4>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              (Click to flip)
            </p>
          </Card>

          {/* Back */}
          <Card
            className="back"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              backgroundColor: 'var(--color-bg-secondary)', // ensuring background
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h4 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
              {card.answer}
            </h4>
          </Card>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-md)',
        }}
      >
        <Button onClick={handlePrev} variant="secondary">
          Previous
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};

// -- Sub-component: Sound Visualizer (Mock Removed) --

const VisualAids: React.FC = () => {
  // Simulate changing sound environment
  React.useEffect(() => {
    // Mock detection logic
  }, []);

  return (
    <div
      className="visual-aids-grid"
      style={{ display: 'grid', gap: 'var(--spacing-lg)' }}
    >
      <Card title="Interactive Flashcards">
        <Flashcard />
      </Card>

      <div className="w-full">
        {/* SoundVisualizer now contains its own Card, so we just render it directly */}
        <SoundVisualizer />
      </div>
    </div>
  );
};

export default VisualAids;
