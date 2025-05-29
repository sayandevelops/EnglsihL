
import RoleplayClient from './components/roleplay-client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RoleplayPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Interactive Roleplay</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Practice your spoken English in simulated real-life scenarios. 
            Choose a scenario and start conversing with LinguaMate!
          </CardDescription>
        </CardHeader>
      </Card>
      <RoleplayClient />
    </div>
  );
}
