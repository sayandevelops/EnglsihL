
"use client";

import { useState, useTransition } from 'react';
import { explainVocabulary } from '@/ai/flows/vocabulary-explainer';
import type { VocabularyExplainerInput, VocabularyExplainerOutput } from '@/ai/flows/vocabulary-explainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, BookOpenCheck, Sparkles, ListMinus, ListPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function VocabularyClient() {
  const [word, setWord] = useState('');
  const [languageCode, setLanguageCode] = useState('');
  const [result, setResult] = useState<VocabularyExplainerOutput | null>(null);
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
        const input: VocabularyExplainerInput = { 
          word: word.trim(),
        };
        if (languageCode.trim()) {
          input.nativeLanguageCode = languageCode.trim();
        }
        
        const aiOutput = await explainVocabulary(input);
        setResult(aiOutput);
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
                placeholder="e.g., enthusiastic, ubiquitous"
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
              <p className="text-sm text-muted-foreground mt-1">For translation to your native language.</p>
            </div>
            <Button type="submit" disabled={isPending} className="w-full text-base py-3">
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <><Sparkles className="mr-2 h-5 w-5" /> Explain Word</>}
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
        <Card className="shadow-lg bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
              <BookOpenCheck className="h-8 w-8 mr-3"/>
              {result.word}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <div>
              <h3 className="font-semibold text-xl mb-1 text-accent-foreground">Meaning (English):</h3>
              <p className="p-3 bg-secondary/30 border border-border rounded-md">{result.meaningEnglish}</p>
            </div>

            {result.nativeLanguageTranslation && (
              <div>
                <h3 className="font-semibold text-xl mb-1 text-accent-foreground">Translation ({languageCode || result.nativeLanguageTranslation.split(':')[0].trim()}):</h3>
                <p className="p-3 bg-secondary/30 border border-border rounded-md">{result.nativeLanguageTranslation}</p>
              </div>
            )}

            {result.pronunciationIPA && (
              <div>
                <h3 className="font-semibold text-xl mb-1 text-accent-foreground">Pronunciation (IPA):</h3>
                <p className="p-3 bg-secondary/30 border border-border rounded-md font-mono text-base">{result.pronunciationIPA}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-xl mb-1 text-accent-foreground">Example Sentence:</h3>
              <p className="italic p-3 bg-secondary/30 border border-border rounded-md">"{result.exampleSentence}"</p>
            </div>

            {result.usageTip && (
              <div>
                <h3 className="font-semibold text-xl mb-1 text-accent-foreground">Usage Tip:</h3>
                <p className="p-3 bg-secondary/30 border border-border rounded-md">{result.usageTip}</p>
              </div>
            )}
            
            <Separator className="my-6"/>

            {result.synonyms && result.synonyms.length > 0 && (
              <div>
                <h3 className="font-semibold text-xl mb-2 text-accent-foreground flex items-center"><ListPlus className="h-6 w-6 mr-2 text-green-600"/>Synonyms:</h3>
                <div className="flex flex-wrap gap-2">
                  {result.synonyms.map((s, i) => (
                    <Badge key={i} variant="outline" className="text-base bg-green-100 border-green-300 text-green-800">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {result.antonyms && result.antonyms.length > 0 && (
              <div>
                <h3 className="font-semibold text-xl mb-2 text-accent-foreground flex items-center"><ListMinus className="h-6 w-6 mr-2 text-red-600"/>Antonyms:</h3>
                <div className="flex flex-wrap gap-2">
                  {result.antonyms.map((a, i) => (
                    <Badge key={i} variant="outline" className="text-base bg-red-100 border-red-300 text-red-800">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
            
          </CardContent>
        </Card>
      )}
    </div>
  );
}
