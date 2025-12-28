'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GIF_DICTIONARY, BASE_GIF_URL } from '@/data/gifDictionary';
import { rephraseWithAI } from '@/utils/textProcessing';
import { preloadGifDurations } from '@/utils/gifUtils';
import Card from '@/components/Card';
import Button from './Button';

interface SignLanguagePlayerProps {
  text: string;
}

const SignLanguagePlayer: React.FC<SignLanguagePlayerProps> = ({ text }) => {
  const [wordQueue, setWordQueue] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentOriginal, setCurrentOriginal] = useState('');
  const [currentTranslated, setCurrentTranslated] = useState('');
  const [wordDurations, setWordDurations] = useState<Record<string, number>>({});
  const previousTextRef = useRef('');
  const processingRef = useRef(false);

  // Process text when it changes - non-blocking
  useEffect(() => {
    if (!text || text === previousTextRef.current) return;

    // Only process new portion of text
    const newPortion = text.slice(previousTextRef.current.length).trim();
    
    if (newPortion && !processingRef.current) {
      processingRef.current = true;
      
      // Store the current segment's original text
      setCurrentOriginal(newPortion);
      
      // Process in background without blocking
      rephraseWithAI(newPortion)
        .then((rephrased) => {
          if (rephrased) {
            // Update current segment's AI translated text
            setCurrentTranslated(rephrased);
            
            // Extract words that have GIFs
            const availableWords = rephrased
              .split(/\s+/)
              .filter((word: string) => !!GIF_DICTIONARY[word]);

            if (availableWords.length > 0) {
              // Replace queue with new words (not accumulate)
              setWordQueue(availableWords);
              setCurrentWordIndex(0);
              setIsPlaying(true);
              
              // Preload GIF durations for smooth playback
              preloadGifDurations(availableWords).then(setWordDurations);
            }
          }
        })
        .finally(() => {
          processingRef.current = false;
        });
    }

    previousTextRef.current = text;
  }, [text]);

  // Play All functionality - plays entire transcript
  const handlePlayAll = () => {
    if (!text) return;
    
    // Rephrase the full text
    rephraseWithAI(text).then((rephrased) => {
      if (rephrased) {
        setCurrentOriginal(text);
        setCurrentTranslated(rephrased);
        
        const allWords = rephrased
          .split(/\s+/)
          .filter((word: string) => !!GIF_DICTIONARY[word]);

        if (allWords.length > 0) {
          setWordQueue(allWords);
          setCurrentWordIndex(0);
          setIsPlaying(true);
          
          // Preload GIF durations for smooth playback
          preloadGifDurations(allWords).then(setWordDurations);
        }
      }
    });
  };

  // Animation loop with dynamic timing based on actual GIF duration
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && currentWordIndex >= 0) {
      if (currentWordIndex < wordQueue.length) {
        const currentWord = wordQueue[currentWordIndex];
        // Use the preloaded duration for this word, or default to 3 seconds
        const duration = wordDurations[currentWord] || 3000;
        
        timer = setTimeout(() => {
          setCurrentWordIndex((prev) => prev + 1);
        }, duration);
      } else {
        setIsPlaying(false);
      }
    }

    return () => clearTimeout(timer);
  }, [currentWordIndex, isPlaying, wordQueue, wordDurations]);

  const currentWord = wordQueue[currentWordIndex];
  const currentGifUrl = currentWord
    ? `${BASE_GIF_URL}${GIF_DICTIONARY[currentWord]}`
    : null;

  return (
    <>
      {/* Spacer to align with SpeechToText buttons */}
      <div style={{ height: '52px', marginBottom: 'var(--spacing-md)' }} />

      <Card
        title="Sign Language Interpreter"
        className="flex flex-col"
        style={{ height: '500px' }}
      >
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          {isPlaying && currentGifUrl ? (
            <>
              <div
                className="w-full max-w-md relative bg-white rounded-md overflow-hidden flex items-center justify-center shadow-sm"
                style={{ height: '250px' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentGifUrl}
                  alt={`Sign for ${currentWord}`}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div className="mt-4 text-2xl font-bold text-primary">
                {currentWord}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {currentWordIndex + 1} / {wordQueue.length}
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              {wordQueue.length > 0 ? (
                <div className="flex flex-col items-center gap-4">
                  <p>Finished playing sequence.</p>
                  {currentTranslated && (
                    <Button onClick={handlePlayAll} variant="secondary">
                      Replay All
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">👋</span>
                  <p>Start speaking to see sign language interpretation.</p>
                  <p className="text-xs mt-2 opacity-70">
                    Note: Only supported words will be shown.
                  </p>
                  {currentTranslated && (
                    <Button
                      onClick={handlePlayAll}
                      variant="secondary"
                      className="mt-4"
                    >
                      Replay All
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {currentTranslated && (
          <div className="mt-4 p-3 bg-muted rounded-md text-sm space-y-2">
            <div>
              <strong>Original: </strong>
              <span className="text-muted-foreground">{currentOriginal}</span>
            </div>
            <div>
              <strong>AI Translated: </strong>
              <span className="text-primary font-medium">{currentTranslated}</span>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default SignLanguagePlayer;
