// src/ai/flows/pronunciation-feedback.ts
'use server';
/**
 * @fileOverview Provides feedback on English pronunciation.
 *
 * - pronunciationFeedback - A function that provides feedback on the user's pronunciation.
 * - PronunciationFeedbackInput - The input type for the pronunciationFeedback function.
 * - PronunciationFeedbackOutput - The return type for the pronunciationFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PronunciationFeedbackInputSchema = z.object({
  text: z.string().describe('The English text that the user is trying to pronounce.'),
  userRecording: z
    .string()
    .describe(
      'The user recording of their pronunciation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type PronunciationFeedbackInput = z.infer<typeof PronunciationFeedbackInputSchema>;

const PronunciationFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Feedback on the user pronunciation.'),
});
export type PronunciationFeedbackOutput = z.infer<typeof PronunciationFeedbackOutputSchema>;

export async function pronunciationFeedback(input: PronunciationFeedbackInput): Promise<PronunciationFeedbackOutput> {
  return pronunciationFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pronunciationFeedbackPrompt',
  input: {schema: PronunciationFeedbackInputSchema},
  output: {schema: PronunciationFeedbackOutputSchema},
  prompt: `You are an English pronunciation tutor. A student is trying to pronounce the following text:

  {{text}}

You have received an audio recording of their attempt:

  {{media url=userRecording}}

  Please provide specific, actionable feedback to the student to help them improve their pronunciation. Focus on specific sounds or words where they can improve. Do not be generic.
  `,
});

const pronunciationFeedbackFlow = ai.defineFlow(
  {
    name: 'pronunciationFeedbackFlow',
    inputSchema: PronunciationFeedbackInputSchema,
    outputSchema: PronunciationFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
