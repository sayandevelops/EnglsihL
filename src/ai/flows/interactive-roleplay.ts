'use server';

/**
 * @fileOverview Interactive roleplay flow for practicing spoken English in simulated scenarios.
 *
 * - interactiveRoleplay - A function that initiates and manages the interactive roleplay.
 * - InteractiveRoleplayInput - The input type for the interactiveRoleplay function.
 * - InteractiveRoleplayOutput - The return type for the interactiveRoleplay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveRoleplayInputSchema = z.object({
  scenario: z
    .string()
    .describe(
      'The scenario for the roleplay (e.g., at an airport, in a restaurant).'
    ),
  userUtterance: z
    .string()
    .describe('The user utterance in the roleplay.'),
});
export type InteractiveRoleplayInput = z.infer<typeof InteractiveRoleplayInputSchema>;

const InteractiveRoleplayOutputSchema = z.object({
  botResponse: z.string().describe('The bot response in the roleplay scenario.'),
});
export type InteractiveRoleplayOutput = z.infer<typeof InteractiveRoleplayOutputSchema>;

export async function interactiveRoleplay(
  input: InteractiveRoleplayInput
): Promise<InteractiveRoleplayOutput> {
  return interactiveRoleplayFlow(input);
}

const interactiveRoleplayPrompt = ai.definePrompt({
  name: 'interactiveRoleplayPrompt',
  input: {
    schema: InteractiveRoleplayInputSchema,
  },
  output: {
    schema: InteractiveRoleplayOutputSchema,
  },
  prompt: `You are LinguaMate, an English Learning Assistant. You are helping the user practice spoken English in a roleplay scenario.

The scenario is: {{{scenario}}}

User: {{{userUtterance}}}

Respond as LinguaMate within the context of the scenario. Keep responses concise and helpful for practicing English conversation. Focus on natural, idiomatic language.

Your Response: `,
});

const interactiveRoleplayFlow = ai.defineFlow(
  {
    name: 'interactiveRoleplayFlow',
    inputSchema: InteractiveRoleplayInputSchema,
    outputSchema: InteractiveRoleplayOutputSchema,
  },
  async input => {
    const {output} = await interactiveRoleplayPrompt(input);
    return output!;
  }
);
