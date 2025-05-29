
"use client"; // Make this a client component for auth check

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpenText, Mic, MessageSquare, SpellCheck2, List, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Vocabulary Builder",
    description: "Learn new words, their meanings, pronunciations, and example sentences. Translate to your native language.",
    icon: BookOpenText,
    href: "/vocabulary",
    imgSrc: "https://placehold.co/600x400.png",
    imgAlt: "Abstract representation of books and learning",
    aiHint: "books learning"
  },
  {
    title: "Pronunciation Practice",
    description: "Get feedback on your English pronunciation to sound more natural.",
    icon: Mic,
    href: "/pronunciation",
    imgSrc: "https://placehold.co/600x400.png",
    imgAlt: "Sound waves and microphone",
    aiHint: "sound waves"
  },
  {
    title: "Interactive Roleplay",
    description: "Practice spoken English in real-life scenarios like ordering at a restaurant or checking in at an airport.",
    icon: MessageSquare,
    href: "/roleplay",
    imgSrc: "https://placehold.co/600x400.png",
    imgAlt: "Two people talking in a simulation",
    aiHint: "conversation simulation"
  },
  {
    title: "Grammar Assistance",
    description: "Understand English grammar rules and get your sentences corrected with detailed explanations.",
    icon: SpellCheck2,
    href: "/grammar",
    imgSrc: "https://placehold.co/600x400.png",
    imgAlt: "Correcting grammar on a paper",
    aiHint: "grammar check"
  },
  {
    title: "Curated Vocabulary Lists",
    description: "Access vocabulary lists tailored for different proficiency levels – beginner, intermediate, and advanced.",
    icon: List,
    href: "/vocab-lists",
    imgSrc: "https://placehold.co/600x400.png",
    imgAlt: "A list of words on a screen",
    aiHint: "word list"
  },
];

export default function ExplorePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.32))] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary mb-4">Welcome to LinguaVerse</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your personal AI-powered assistant to master the English language. Explore features designed to enhance your vocabulary, pronunciation, grammar, and conversational skills.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
               <Image 
                src={feature.imgSrc} 
                alt={feature.imgAlt} 
                width={600} 
                height={400} 
                className="w-full h-48 object-cover"
                data-ai-hint={feature.aiHint}
              />
            </CardHeader>
            <CardContent className="p-6 flex flex-col flex-grow">
              <div className="flex items-center mb-3">
                <feature.icon className="h-8 w-8 text-primary mr-3" />
                <CardTitle className="text-2xl font-semibold">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground mb-6 flex-grow">{feature.description}</CardDescription>
              <Link href={feature.href} passHref>
                <Button variant="default" className="w-full mt-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
