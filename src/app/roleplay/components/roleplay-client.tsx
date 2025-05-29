
"use client";

import { useState, useTransition, useRef, useEffect } from 'react';
import { interactiveRoleplay } from '@/ai/flows/interactive-roleplay';
import type { InteractiveRoleplayInput, InteractiveRoleplayOutput } from '@/ai/flows/interactive-roleplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Send, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const commonScenarios = [
  "Ordering food at a restaurant",
  "Checking in at an airport",
  "Asking for directions",
  "Shopping for clothes",
  "A job interview",
];

export default function RoleplayClient() {
  const [scenario, setScenario] = useState('');
  const [userUtterance, setUserUtterance] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isScenarioSet, setIsScenarioSet] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleScenarioSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!scenario.trim()) {
      setError("Please enter or select a scenario.");
      return;
    }
    setError(null);
    setMessages([]);
    setIsScenarioSet(true);
    setMessages([{ sender: 'bot', text: `Okay, let's practice the scenario: "${scenario}". What would you like to say first?` }]);
  };
  
  const handleMessageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userUtterance.trim()) return;

    const newUserMessage: Message = { sender: 'user', text: userUtterance };
    setMessages(prev => [...prev, newUserMessage]);
    setUserUtterance('');
    setError(null);

    startTransition(async () => {
      try {
        const input: InteractiveRoleplayInput = { scenario, userUtterance };
        const aiOutput: InteractiveRoleplayOutput = await interactiveRoleplay(input);
        setMessages(prev => [...prev, { sender: 'bot', text: aiOutput.botResponse }]);
      } catch (e) {
        console.error(e);
        setError('Failed to get bot response. Please try again.');
        setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I encountered an error. Please try again."}]);
      }
    });
  };

  if (!isScenarioSet) {
    return (
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-xl font-semibold">Set Up Your Roleplay Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScenarioSubmit} className="space-y-4">
            <div>
              <Label htmlFor="scenario" className="text-base font-medium">Scenario</Label>
              <Input
                id="scenario"
                type="text"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="e.g., At a coffee shop"
                className="mt-1 text-base"
                required
              />
            </div>
            <div className="my-2">
                <p className="text-sm text-muted-foreground mb-2">Or pick a common one:</p>
                <div className="flex flex-wrap gap-2">
                    {commonScenarios.map(s => (
                        <Button key={s} type="button" variant="outline" size="sm" onClick={() => setScenario(s)}>
                            {s}
                        </Button>
                    ))}
                </div>
            </div>
            <Button type="submit" className="w-full text-base py-3">
              Start Roleplay
            </Button>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg flex flex-col h-[70vh] max-h-[800px]">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Roleplay: <span className="text-primary">{scenario}</span></CardTitle>
            <Button variant="outline" size="sm" onClick={() => {setIsScenarioSet(false); setScenario(''); setMessages([]);}}>Change Scenario</Button>
        </div>
      </CardHeader>
      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && <Bot className="h-8 w-8 text-primary flex-shrink-0" />}
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 shadow ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <p className="text-base">{msg.text}</p>
            </div>
            {msg.sender === 'user' && <User className="h-8 w-8 text-accent flex-shrink-0" />}
          </div>
        ))}
        {isPending && (
            <div className="flex justify-start gap-2 items-end">
                <Bot className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="max-w-[70%] rounded-lg px-4 py-2 shadow bg-muted text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            </div>
        )}
      </ScrollArea>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleMessageSubmit} className="flex w-full items-center space-x-2">
          <Textarea
            value={userUtterance}
            onChange={(e) => setUserUtterance(e.target.value)}
            placeholder="Type your response..."
            className="flex-grow text-base resize-none"
            rows={1}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleMessageSubmit(e as any);
                }
            }}
          />
          <Button type="submit" size="icon" disabled={isPending || !userUtterance.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
       {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
