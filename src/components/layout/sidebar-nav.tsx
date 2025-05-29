
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpenText, Mic, MessageSquare, SpellCheck2, List, Compass } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore Features', icon: Compass },
  { href: '/vocabulary', label: 'Vocabulary', icon: BookOpenText },
  { href: '/pronunciation', label: 'Pronunciation', icon: Mic },
  { href: '/roleplay', label: 'Roleplay', icon: MessageSquare },
  { href: '/grammar', label: 'Grammar', icon: SpellCheck2 },
  { href: '/vocab-lists', label: 'Vocab Lists', icon: List },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              className={cn(
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              )}
              tooltip={item.label}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
