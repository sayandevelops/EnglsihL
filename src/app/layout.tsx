import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import SidebarNav from '@/components/layout/sidebar-nav';
import { Button } from '@/components/ui/button';
import { Languages, Settings } from 'lucide-react';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LinguaVerse - Your English Learning Assistant',
  description: 'LinguaVerse helps you learn English vocabulary, grammar, pronunciation, and practice conversations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <SidebarProvider defaultOpen>
          <Sidebar className="bg-sidebar text-sidebar-foreground" collapsible="icon">
            <SidebarHeader className="p-4">
              <Link href="/" className="flex items-center gap-2">
                <Languages className="h-8 w-8 text-sidebar-primary-foreground" />
                <h1 className="text-2xl font-semibold text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">
                  LinguaVerse
                </h1>
              </Link>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarNav />
            </SidebarContent>
            <SidebarFooter className="p-4">
              <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center">
                <Settings className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Button>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="bg-background min-h-screen">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end">
                <SidebarTrigger className="md:hidden" />
                {/* Add any header content for the main area if needed */}
            </header>
            <main className="p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
