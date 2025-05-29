
import VocabListsClient from './components/vocab-lists-client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function VocabListsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Curated Vocabulary Lists</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Request vocabulary lists tailored to specific needs or proficiency levels. 
            For example, "10 common phrasal verbs" or "20 advanced adjectives".
          </CardDescription>
        </CardHeader>
      </Card>
      <VocabListsClient />
    </div>
  );
}
