// The `use server` directive is required for Server Components.
'use server';

/**
 * @fileOverview Provides explanations of English grammar rules and sentence correction.
 *
 * - grammarAssistance - A function that provides grammar assistance.
 * - GrammarAssistanceInput - The input type for the grammarAssistance function.
 * - GrammarAssistanceOutput - The return type for the grammarAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GrammarAssistanceInputSchema = z.object({
  text: z.string().describe('The text to be analyzed for grammar and corrected if necessary.'),
  languageCode: z.string().optional().describe('The user\u0027s native language code (e.g., \"bn\" for Bengali, \"hi\" for Hindi).'),
});
export type GrammarAssistanceInput = z.infer<typeof GrammarAssistanceInputSchema>;

const GrammarAssistanceOutputSchema = z.object({
  correctedText: z.string().describe('The corrected text, if any errors were found.'),
  explanation: z.string().describe('An explanation of the grammar rules relevant to the corrections made.'),
});
export type GrammarAssistanceOutput = z.infer<typeof GrammarAssistanceOutputSchema>;

export async function grammarAssistance(input: GrammarAssistanceInput): Promise<GrammarAssistanceOutput> {
  return grammarAssistanceFlow(input);
}

const grammarAssistancePrompt = ai.definePrompt({
  name: 'grammarAssistancePrompt',
  input: {schema: GrammarAssistanceInputSchema},
  output: {schema: GrammarAssistanceOutputSchema},
  prompt: `You are LinguaMate, an English learning assistant. You will analyze the provided text for grammar errors and provide a corrected version along with an explanation of the grammar rules applied.

Text: {{{text}}}

{{#if languageCode}}
The user's native language code is: {{{languageCode}}}.  Provide a brief explanation of the grammar rules in their native language as well.
{{/if}}

Output the corrected text and the explanation of the grammar rules used in the following format:

Corrected Text: [Corrected text here]
Explanation: [Explanation of grammar rules here]`,
});

const grammarAssistanceFlow = ai.defineFlow(
  {
    name: 'grammarAssistanceFlow',
    inputSchema: GrammarAssistanceInputSchema,
    outputSchema: GrammarAssistanceOutputSchema,
  },
  async input => {
    const {output} = await grammarAssistancePrompt(input);
    return output!;
  }
);
