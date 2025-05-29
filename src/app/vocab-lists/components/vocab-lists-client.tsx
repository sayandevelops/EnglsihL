
"use client";

import { useState, useTransition } from 'react';
import { grammarAssistance } from '@/ai/flows/grammar-assistance'; // Re-using grammarAssistance for list generation
import type { GrammarAssistanceInput, GrammarAssistanceOutput } from '@/ai/flows/grammar-assistance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, ListChecks } from 'lucide-react';

export default function VocabListsClient() {
  const [request, setRequest] = useState('');
  const [result, setResult] = useState<GrammarAssistanceOutput | null>(null); // Output will be in 'explanation' field
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request.trim()) {
      setError("Please enter a request for a vocabulary list.");
      return;
    }
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        // Frame the request to the grammarAssistance flow
        const input: GrammarAssistanceInput = { 
          text: `Generate a vocabulary list based on the following request: "${request}". Please format the list clearly. Include word, meaning, and an example sentence for each item if possible.`,
        };
        // No language code needed here typically, as we want the list in English.
        const aiOutput = await grammarAssistance(input);
        // The AI will likely put the list in the 'explanation' field.
        // 'correctedText' might just be the original request or something similar.
        setResult(aiOutput); 
      } catch (e) {
        console.error(e);
        setError('Failed to generate vocabulary list. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="request" className="text-base font-medium">Vocabulary List Request</Label>
              <Input
                id="request"
                type="text"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="e.g., 10 English words for beginners"
                className="mt-1 text-base"
                required
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full text-base py-3">
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Get Vocabulary List'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="shadow-lg bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center">
              <ListChecks className="h-7 w-7 mr-2" /> Vocabulary List
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            <p className="text-sm text-muted-foreground mb-2">
              LinguaMate's response to your request: "{result.correctedText}"
            </p>
            <div className="whitespace-pre-wrap p-4 bg-blue-50 border border-blue-200 rounded-md">
              {result.explanation}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
