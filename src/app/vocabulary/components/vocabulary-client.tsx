
"use client";

import { useState, useTransition } from 'react';
import { grammarAssistance } from '@/ai/flows/grammar-assistance';
import type { GrammarAssistanceInput, GrammarAssistanceOutput } from '@/ai/flows/grammar-assistance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface ParsedVocabulary {
  word?: string;
  meaningEnglish?: string;
  meaningNative?: string;
  pronunciation?: string;
  example?: string;
  usageTip?: string;
  rawExplanation?: string;
}

// Best-effort parser for the AI's free-form output
function parseVocabularyOutput(text: string, correctedText: string): ParsedVocabulary {
  const result: ParsedVocabulary = { word: correctedText, rawExplanation: text };
  const lines = text.split('\\n').map(line => line.trim());

  lines.forEach(line => {
    if (line.toLowerCase().startsWith("meaning (english):")) {
      result.meaningEnglish = line.substring("Meaning (English):".length).trim();
    } else if (line.match(/meaning \((.*?)\):/i)) {
        const match = line.match(/meaning \((.*?)\):/i);
        if (match && match[1].toLowerCase() !== 'english') {
             result.meaningNative = line.substring(match[0].length).trim();
        }
    } else if (line.toLowerCase().startsWith("pronunciation:")) {
      result.pronunciation = line.substring("Pronunciation:".length).trim();
    } else if (line.toLowerCase().startsWith("example:")) {
      result.example = line.substring("Example:".length).trim();
    } else if (line.toLowerCase().startsWith("usage tip:")) {
      result.usageTip = line.substring("Usage Tip:".length).trim();
    }
  });
  
  // If specific fields are not found, try to extract from a less structured explanation
  if (!result.meaningEnglish && !result.meaningNative && !result.pronunciation && !result.example) {
    // This is a fallback and might not be very accurate
    // For now, just keeping rawExplanation is safer
  }

  return result;
}


export default function VocabularyClient() {
  const [word, setWord] = useState('');
  const [languageCode, setLanguageCode] = useState('');
  const [result, setResult] = useState<ParsedVocabulary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!word.trim()) {
      setError("Please enter a word.");
      return;
    }
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const input: GrammarAssistanceInput = { 
          text: `Explain the word: "${word}" including its meaning in English, IPA pronunciation, an example sentence, and a usage tip.`,
        };
        if (languageCode.trim()) {
          input.text += ` Also provide the meaning in ${languageCode}.`;
          input.languageCode = languageCode.trim();
        }
        
        const aiOutput: GrammarAssistanceOutput = await grammarAssistance(input);
        // The AI flow returns `correctedText` and `explanation`.
        // We'll use `correctedText` as the word (hopefully it's the same or a correction)
        // and parse `explanation` for the details.
        setResult(parseVocabularyOutput(aiOutput.explanation, aiOutput.correctedText));
      } catch (e) {
        console.error(e);
        setError('Failed to get vocabulary information. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="word" className="text-base font-medium">English Word</Label>
              <Input
                id="word"
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g., enthusiastic"
                className="mt-1 text-base"
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
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Get Definition'}
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
            <CardTitle className="text-3xl font-bold text-primary">{result.word || "Word Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-lg">
            {result.meaningEnglish && (
              <p><strong>Meaning (English):</strong> {result.meaningEnglish}</p>
            )}
            {result.meaningNative && (
              <p><strong>Meaning ({languageCode || 'Native'}):</strong> {result.meaningNative}</p>
            )}
            {result.pronunciation && (
              <p><strong>Pronunciation:</strong> <span className="font-mono">{result.pronunciation}</span></p>
            )}
            {result.example && (
              <p><strong>Example:</strong> <em>{result.example}</em></p>
            )}
            {result.usageTip && (
              <p><strong>Usage Tip:</strong> {result.usageTip}</p>
            )}
            {(!result.meaningEnglish && !result.pronunciation && result.rawExplanation) && (
                 <div>
                    <p><strong>Explanation:</strong></p>
                    <p className="whitespace-pre-wrap">{result.rawExplanation}</p>
                 </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
