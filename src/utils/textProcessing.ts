import { GIF_DICTIONARY } from '../data/gifDictionary';

/**
 * Finds the closest matching word from the dictionary for a given word
 * Uses simple string similarity (could be enhanced with Levenshtein distance)
 */
function findClosestWord(word: string, availableWords: string[]): string | null {
  const upperWord = word.toUpperCase();
  
  // Direct match
  if (availableWords.includes(upperWord)) {
    return upperWord;
  }
  
  // Common substitutions map
  const substitutions: Record<string, string> = {
    // Pronouns
    'I': 'ME',
    'HE': 'PERSON',
    'SHE': 'PERSON',
    'THEY': 'PEOPLE',
    'IT': 'THAT',
    'US': 'WE',
    'HIM': 'PERSON',
    'HER': 'PERSON',
    'THEM': 'PEOPLE',
    
    // Verbs
    'AM': 'BE',
    'IS': 'BE',
    'ARE': 'BE',
    'WAS': 'BE',
    'WERE': 'BE',
    'HAVE': 'GIVE',
    'HAS': 'GIVE',
    'HAD': 'GIVE',
    'WANT': 'NEED',
    'WANTED': 'NEED',
    'NEEDS': 'NEED',
    'GOING': 'GO',
    'WENT': 'GO',
    'COME': 'GO',
    'CAME': 'GO',
    'SAID': 'SAY',
    'SAYS': 'SAY',
    'TOLD': 'TELL',
    'TELLS': 'TELL',
    'LOOKED': 'LOOK',
    'LOOKS': 'LOOK',
    'FELT': 'FEEL',
    'FEELS': 'FEEL',
    
    // Adjectives
    'GOOD': 'BEST',
    'GREAT': 'BEST',
    'NICE': 'GOOD',
    'FINE': 'GOOD',
    'OKAY': 'GOOD',
    'OK': 'GOOD',
    'TERRIBLE': 'BAD',
    'AWFUL': 'BAD',
    'HORRIBLE': 'BAD',
    'LARGE': 'BIG',
    'HUGE': 'BIG',
    'TINY': 'SMALL',
    'LITTLE': 'SMALL',
    
    // Common words
    'THE': 'THAT',
    'THIS': 'THAT',
    'THESE': 'THAT',
    'THOSE': 'THAT',
    'AND': 'WITH',
    'BUT': 'NOT',
    'OR': 'QUESTION',
    'FROM': 'AT',
    'TO': 'AT',
    'FOR': 'AT',
    'OF': 'AT',
    'BY': 'AT',
    'AS': 'LIKE',
    'THAN': 'MORE',
    'THEN': 'AFTER',
    'WHEN': 'TIME',
    'WHERE': 'AREA',
    'HOW': 'QUESTION',
    'WHAT': 'QUESTION',
    'WHO': 'PERSON',
    'WHICH': 'QUESTION',
  };
  
  // Check substitution map
  if (substitutions[upperWord] && availableWords.includes(substitutions[upperWord])) {
    return substitutions[upperWord];
  }
  
  // Check if it's a plural - try singular
  if (upperWord.endsWith('S') && upperWord.length > 2) {
    const singular = upperWord.slice(0, -1);
    if (availableWords.includes(singular)) {
      return singular;
    }
  }
  
  // Check if it's past tense - try present
  if (upperWord.endsWith('ED') && upperWord.length > 3) {
    const present = upperWord.slice(0, -2);
    if (availableWords.includes(present)) {
      return present;
    }
    // Try with just 'D' removed
    const presentD = upperWord.slice(0, -1);
    if (availableWords.includes(presentD)) {
      return presentD;
    }
  }
  
  // Check if it's present continuous - try base form
  if (upperWord.endsWith('ING') && upperWord.length > 4) {
    const base = upperWord.slice(0, -3);
    if (availableWords.includes(base)) {
      return base;
    }
  }
  
  // No match found
  return null;
}

/**
 * Rephrases a sentence using only words available in the GIF dictionary
 * Substitutes words with closest matches or removes them if no match exists
 */
export function rephraseSentence(sentence: string): string {
  const availableWords = Object.keys(GIF_DICTIONARY);
  
  // Split sentence into words and clean
  const words = sentence
    .toUpperCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  // Process each word
  const rephrased: string[] = [];
  
  for (const word of words) {
    const match = findClosestWord(word, availableWords);
    if (match) {
      rephrased.push(match);
    }
    // If no match, skip the word (as per requirements)
  }
  
  return rephrased.join(' ');
}

/**
 * Extracts only the new portion of text (new sentence/words) from the updated text
 * Returns the new words in their original order to maintain proper sequence
 */
export function getNewWords(previousText: string, newText: string): string[] {
  // If no previous text, all of newText is new
  if (!previousText || previousText.trim() === '') {
    return newText
      .toUpperCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);
  }
  
  // If newText doesn't start with previousText, it's a completely new sentence
  const prevUpper = previousText.toUpperCase().trim();
  const newUpper = newText.toUpperCase().trim();
  
  if (!newUpper.startsWith(prevUpper)) {
    // Completely new text, return all of it
    return newUpper
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);
  }
  
  // Extract only the new portion (what was added)
  const newPortion = newText.slice(previousText.length).trim();
  
  if (!newPortion) {
    return [];
  }
  
  return newPortion
    .toUpperCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

/**
 * Uses OpenAI to intelligently rephrase a sentence using only available words
 * Falls back to rule-based rephrasing if API fails
 */
export async function rephraseWithAI(sentence: string): Promise<string> {
  const availableWords = Object.keys(GIF_DICTIONARY);
  
  try {
    const response = await fetch('/api/rephrase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentence,
        availableWords,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('OpenAI API error:', response.status, errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.rephrased) {
      return data.rephrased;
    }
    
    throw new Error('No rephrased text returned');
  } catch (error) {
    console.warn('OpenAI rephrasing failed, using rule-based fallback:', error);
    // Fallback to rule-based rephrasing
    return rephraseSentence(sentence);
  }
}

