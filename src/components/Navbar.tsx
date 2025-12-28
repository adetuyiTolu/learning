'use client';

import React from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/context/AccessibilityContext';
import Button from '@/components/Button';

const Navbar: React.FC = () => {
  const { highContrast, toggleHighContrast, fontSize, setFontSize } =
    useAccessibility();

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-primary)',
      }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--color-text-primary)',
          }}
        >
          AccessLearn
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="flex gap-4">
          <Link href="/transcribe">
            <Button variant="ghost">Transcribe</Button>
          </Link>
          <Link href="/visual-aids">
            <Button variant="ghost">Visual Aids</Button>
          </Link>
        </div>
        <Button
          onClick={toggleHighContrast}
          size="sm"
          variant="secondary"
          aria-pressed={highContrast}
        >
          {highContrast ? 'Normal Contrast' : 'High Contrast'}
        </Button>
        <div
          role="group"
          aria-label="Font Size Controls"
          style={{ display: 'flex', gap: '0.5rem' }}
        >
          <Button
            onClick={() => setFontSize('normal')}
            size="sm"
            variant={fontSize === 'normal' ? 'primary' : 'ghost'}
            aria-label="Normal Font Size"
            aria-pressed={fontSize === 'normal'}
          >
            A
          </Button>
          <Button
            onClick={() => setFontSize('large')}
            size="sm"
            variant={fontSize === 'large' ? 'primary' : 'ghost'}
            aria-label="Large Font Size"
            aria-pressed={fontSize === 'large'}
          >
            A+
          </Button>
          <Button
            onClick={() => setFontSize('xlarge')}
            size="sm"
            variant={fontSize === 'xlarge' ? 'primary' : 'ghost'}
            aria-label="Extra Large Font Size"
            aria-pressed={fontSize === 'xlarge'}
          >
            A++
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
