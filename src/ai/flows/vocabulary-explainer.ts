
'use server';
/**
 * @fileOverview Provides detailed explanations for English vocabulary words.
 *
 * - explainVocabulary - A function that returns detailed information about a word.
 * - VocabularyExplainerInput - The input type for the explainVocabulary function.
 * - VocabularyExplainerOutput - The return type for the explainVocabulary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VocabularyExplainerInputSchema = z.object({
  word: z.string().describe('The English word to be explained.'),
  nativeLanguageCode: z.string().optional().describe('The user\'s native language code (e.g., "bn" for Bengali, "hi" for Hindi) for translation.'),
});
export type VocabularyExplainerInput = z.infer<typeof VocabularyExplainerInputSchema>;

const VocabularyExplainerOutputSchema = z.object({
  word: z.string().describe('The vocabulary word that was explained, potentially corrected or in its base form.'),
  meaningEnglish: z.string().describe('The definition of the word in English.'),
  pronunciationIPA: z.string().optional().describe('The International Phonetic Alphabet (IPA) pronunciation of the word.'),
  exampleSentence: z.string().describe('An example sentence using the word in context.'),
  usageTip: z.string().optional().describe('A helpful tip on how to use the word correctly, common collocations, or typical mistakes to avoid.'),
  nativeLanguageTranslation: z.string().optional().describe('The translation of the word into the user-specified native language, if a language code was provided.'),
  synonyms: z.array(z.string()).optional().describe('A list of synonyms for the word (words with similar meanings).'),
  antonyms: z.array(z.string()).optional().describe('A list of antonyms for the word (words with opposite meanings).'),
});
export type VocabularyExplainerOutput = z.infer<typeof VocabularyExplainerOutputSchema>;

export async function explainVocabulary(input: VocabularyExplainerInput): Promise<VocabularyExplainerOutput> {
  return vocabularyExplainerFlow(input);
}

const vocabularyExplainerPrompt = ai.definePrompt({
  name: 'vocabularyExplainerPrompt',
  input: {schema: VocabularyExplainerInputSchema},
  output: {schema: VocabularyExplainerOutputSchema},
  prompt: `You are LinguaMate, an expert English lexicographer and language tutor.
Your task is to provide a comprehensive explanation for the English word: {{{word}}}.

Please provide the following information:
1.  **Word**: The word itself, ensuring it's the base or most common form if applicable (e.g., "run" instead of "running").
2.  **Meaning (English)**: A clear and concise definition of the word in English.
3.  **Pronunciation (IPA)**: The International Phonetic Alphabet (IPA) transcription. If unsure, you may omit this.
4.  **Example Sentence**: A sentence that clearly demonstrates the word's usage.
5.  **Usage Tip**: A practical tip, common collocations, or frequent errors related to this word. If not applicable, you may omit this.
{{#if nativeLanguageCode}}
6.  **Translation ({{{nativeLanguageCode}}})**: Translate "{{{word}}}" into the language specified by the code: {{{nativeLanguageCode}}}.
{{/if}}
7.  **Synonyms**: Provide a short list (3-5) of synonyms.
8.  **Antonyms**: Provide a short list (3-5) of antonyms, if applicable.

Ensure your response strictly follows the output schema format.
Word to explain: {{{word}}}
{{#if nativeLanguageCode}}
Native language for translation: {{{nativeLanguageCode}}}
{{/if}}
`,
});

const vocabularyExplainerFlow = ai.defineFlow(
  {
    name: 'vocabularyExplainerFlow',
    inputSchema: VocabularyExplainerInputSchema,
    outputSchema: VocabularyExplainerOutputSchema,
  },
  async (input: VocabularyExplainerInput) => {
    // Potentially add pre-processing for the word if needed, e.g., lemmatization,
    // but the prompt currently asks the LLM to handle base form.
    const {output} = await vocabularyExplainerPrompt(input);
    return output!;
  }
);
