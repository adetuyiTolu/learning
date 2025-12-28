'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(
    'normal'
  );

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize =
      (localStorage.getItem('fontSize') as 'normal' | 'large' | 'xlarge') ||
      'normal';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighContrast(savedContrast);

    setFontSize(savedFontSize);
  }, []);

  // Apply high contrast class to body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', highContrast.toString());
  }, [highContrast]);

  // Apply font size scaling to html root
  useEffect(() => {
    const root = document.documentElement;
    switch (fontSize) {
      case 'large':
        root.style.fontSize = '112.5%'; // 18px base
        break;
      case 'xlarge':
        root.style.fontSize = '125%'; // 20px base
        break;
      default:
        root.style.fontSize = '100%'; // 16px base
    }
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);

  return (
    <AccessibilityContext.Provider
      value={{ highContrast, toggleHighContrast, fontSize, setFontSize }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      'useAccessibility must be used within an AccessibilityProvider'
    );
  }
  return context;
};
