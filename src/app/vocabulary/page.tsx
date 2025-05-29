
import VocabularyClient from './components/vocabulary-client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function VocabularyPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Vocabulary Explorer</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Enter an English word to learn its meaning, pronunciation, example sentence, and usage tips. 
            You can also specify a language code (e.g., "bn" for Bengali, "hi" for Hindi) for translations.
          </CardDescription>
        </CardHeader>
      </Card>
      <VocabularyClient />
    </div>
  );
}
