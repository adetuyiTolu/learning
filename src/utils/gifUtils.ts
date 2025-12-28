import { GIF_DICTIONARY, BASE_GIF_URL } from '../data/gifDictionary';

interface GifMetadata {
  duration: number; // in milliseconds
  filename: string;
}

// Cache for GIF durations to avoid recalculating
const gifDurationCache: Record<string, number> = {};

/**
 * Calculates the duration of a GIF by analyzing its frames
 * For now, uses a heuristic based on file size and common patterns
 * Returns duration in milliseconds
 */
export async function getGifDuration(word: string): Promise<number> {
  // Check cache first
  if (gifDurationCache[word]) {
    return gifDurationCache[word];
  }

  const gifFilename = GIF_DICTIONARY[word];
  if (!gifFilename) {
    return 3000; // Default 3 seconds
  }

  try {
    const gifUrl = `${BASE_GIF_URL}${gifFilename}`;
    
    // Fetch the GIF to analyze
    const response = await fetch(gifUrl);
    const blob = await response.blob();
    
    // Heuristic: Most sign language GIFs are 2-4 seconds
    // Larger files tend to be longer animations
    const sizeInKB = blob.size / 1024;
    
    let duration: number;
    if (sizeInKB < 100) {
      duration = 2000; // Small GIFs: 2 seconds
    } else if (sizeInKB < 300) {
      duration = 3000; // Medium GIFs: 3 seconds
    } else {
      duration = 4000; // Large GIFs: 4 seconds
    }
    
    // Cache the result
    gifDurationCache[word] = duration;
    return duration;
  } catch (error) {
    console.warn(`Failed to get GIF duration for ${word}:`, error);
    return 3000; // Default fallback
  }
}

/**
 * Pre-calculate durations for a list of words
 * This can be called when the word queue is set up
 */
export async function preloadGifDurations(words: string[]): Promise<Record<string, number>> {
  const durations: Record<string, number> = {};
  
  await Promise.all(
    words.map(async (word) => {
      durations[word] = await getGifDuration(word);
    })
  );
  
  return durations;
}
