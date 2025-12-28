import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { sentence, availableWords } = await request.json();

    if (!sentence || !availableWords) {
      return NextResponse.json(
        { error: 'Missing sentence or availableWords' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create the prompt for OpenAI with example
    const prompt = `Given a sentence, rephrase it using only words from a provided list. If the exact word is not present, substitute it with words that are almost the same, but only output words that are present in the list. Even conjunctions or nouns other than what present in the list is allowed. Only the words present in the below list. If even the substitute for a word can't be found, then ignore the word. The output should consist only the final sentence. Don't output any word which is not in the list. Always find the comparative closest substitute.

Example Sentence: "The environment is very nice."
Expected rephrase: "ENVIRONMENT VERY GOOD"

Sentence to be converted: "${sentence}"

Word list (${availableWords.length} words):
${availableWords.join(', ')}

Output only the rephrased sentence using words from the list above:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that rephrases sentences using only words from a provided list. Output only the rephrased sentence without explanations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent output
      max_tokens: 100,
    });

    const rephrasedSentence = completion.choices[0]?.message?.content?.trim() || '';

    // Validate that all words in the response are from the available words
    const responseWords = rephrasedSentence
      .toUpperCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);

    const availableWordsUpper = availableWords.map((w: string) => w.toUpperCase());
    const invalidWords = responseWords.filter(
      (word) => !availableWordsUpper.includes(word)
    );

    if (invalidWords.length > 0) {
      console.warn('OpenAI returned invalid words:', invalidWords);
      // Filter out invalid words
      const validWords = responseWords.filter((word) =>
        availableWordsUpper.includes(word)
      );
      return NextResponse.json({
        rephrased: validWords.join(' '),
        warning: 'Some words were filtered out',
      });
    }

    return NextResponse.json({ rephrased: rephrasedSentence });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to rephrase sentence' },
      { status: 500 }
    );
  }
}
