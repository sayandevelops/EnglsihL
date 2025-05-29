
import GrammarClient from './components/grammar-client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function GrammarPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Grammar Helper</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Enter English text to get it corrected and understand the grammar rules applied. 
            Optionally, provide your native language code for explanations in your language too.
          </CardDescription>
        </CardHeader>
      </Card>
      <GrammarClient />
    </div>
  );
}
