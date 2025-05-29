
import PronunciationClient from './components/pronunciation-client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PronunciationPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Pronunciation Practice</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Enter the English text you are trying to pronounce and provide your recording (as a data URI) to get feedback on your pronunciation.
          </CardDescription>
        </CardHeader>
      </Card>
      <PronunciationClient />
    </div>
  );
}
