
"use client";

import { useState, useTransition } from 'react';
import { pronunciationFeedback } from '@/ai/flows/pronunciation-feedback';
import type { PronunciationFeedbackInput, PronunciationFeedbackOutput } from '@/ai/flows/pronunciation-feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function PronunciationClient() {
  const [text, setText] = useState('');
  const [userRecording, setUserRecording] = useState(''); // Expects data URI string
  const [result, setResult] = useState<PronunciationFeedbackOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim() || !userRecording.trim()) {
      setError("Please enter the text and your recording data URI.");
      return;
    }
    if (!userRecording.startsWith('data:')) {
      setError("The user recording must be a valid data URI (e.g., data:audio/wav;base64,...).");
      return;
    }
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const input: PronunciationFeedbackInput = { text, userRecording };
        const aiOutput = await pronunciationFeedback(input);
        setResult(aiOutput);
      } catch (e) {
        console.error(e);
        setError('Failed to get pronunciation feedback. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="text" className="text-base font-medium">Text to Pronounce</Label>
              <Input
                id="text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., How are you today?"
                className="mt-1 text-base"
                required
              />
            </div>
            <div>
              <Label htmlFor="userRecording" className="text-base font-medium">Your Recording (Data URI)</Label>
              <Textarea
                id="userRecording"
                value={userRecording}
                onChange={(e) => setUserRecording(e.target.value)}
                placeholder="Paste data URI of your audio recording here (e.g., data:audio/wav;base64,...)"
                className="mt-1 text-base"
                rows={3}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Note: For a real application, a direct audio recording feature would be implemented. 
                For now, please provide a Base64 encoded data URI.
              </p>
            </div>
            <Button type="submit" disabled={isPending} className="w-full text-base py-3">
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Get Feedback'}
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
              <CheckCircle className="h-7 w-7 mr-2 text-green-500" /> Pronunciation Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            <p className="whitespace-pre-wrap">{result.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
