
"use client";

import { useState, useTransition } from 'react';
import { grammarAssistance } from '@/ai/flows/grammar-assistance';
import type { GrammarAssistanceInput, GrammarAssistanceOutput } from '@/ai/flows/grammar-assistance';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function GrammarClient() {
  const [text, setText] = useState('');
  const [languageCode, setLanguageCode] = useState('');
  const [result, setResult] = useState<GrammarAssistanceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const input: GrammarAssistanceInput = { text };
        if (languageCode.trim()) {
          input.languageCode = languageCode.trim();
        }
        const aiOutput = await grammarAssistance(input);
        setResult(aiOutput);
      } catch (e) {
        console.error(e);
        setError('Failed to get grammar assistance. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="text" className="text-base font-medium">Your Text</Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., I goed to the store yesterday."
                className="mt-1 text-base"
                rows={5}
                required
              />
            </div>
            <div>
              <Label htmlFor="languageCode" className="text-base font-medium">Native Language Code (Optional)</Label>
              <Input
                id="languageCode"
                type="text"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                placeholder="e.g., bn (Bengali), hi (Hindi), es (Spanish)"
                className="mt-1 text-base"
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full text-base py-3">
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Check Grammar'}
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
        <Card className="shadow-lg bg-gradient-to-br from-accent/10 via-background to-background">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-accent-foreground flex items-center">
              <CheckCircle className="h-7 w-7 mr-2 text-green-500" /> Grammar Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <div>
              <h3 className="font-semibold text-xl mb-1 text-primary">Corrected Text:</h3>
              <p className="p-3 bg-green-50 border border-green-200 rounded-md whitespace-pre-wrap">{result.correctedText}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-xl mb-1 text-primary">Explanation:</h3>
              <p className="whitespace-pre-wrap p-3 bg-blue-50 border border-blue-200 rounded-md">{result.explanation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
