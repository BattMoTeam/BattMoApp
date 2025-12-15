
'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { HouseIcon, InboxIcon, ZapIcon } from 'lucide-react';
import Logo, { LogoLink } from '@workspace/ui/components/logo';
import { Button } from '@workspace/ui/components/ui/button';
import { Input } from '@workspace/ui/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@workspace/ui/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/ui/popover';

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: '/simulator', label: 'Simulator', icon: HouseIcon, active: false },
  { href: '/library', label: 'Library', icon: InboxIcon },
  { href: '/about', label: 'About', icon: ZapIcon },
];

export default function TitleBar() {
  const headerRef = useRef<HTMLElement | null>(null);

  // SSR fallback — set a default before hydrating to avoid layout shifts.
  useEffect(() => {
    const root = document.documentElement;
    if (!root.style.getPropertyValue('--app-nav-height')) {
      root.style.setProperty('--app-nav-height', '64px'); // fallback
    }
  }, []);

  // Measure height and keep the variable in sync (mount + resize)
  useLayoutEffect(() => {
    const root = document.documentElement;

    const updateHeight = () => {
      const el = headerRef.current;
      if (!el) return;
      const h = el.offsetHeight;
      root.style.setProperty('--app-nav-height', `${h}px`);
    };

    updateHeight();

    // Recalculate on resize and font loading changes
    const resize = () => updateHeight();
    window.addEventListener('resize', resize);

    // Optional: re-measure after fonts load (can slightly change height)
    if (document.fonts && 'ready' in document.fonts) {
      (document.fonts as any).ready?.then(updateHeight).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <header
      id="app-nav"
      ref={headerRef}
      className="bg-card px-18 md:px-22"
    >
      <div className="flex h-24 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">

          {/* Logo */}
          <div className="flex items-center">
            <LogoLink />
          </div>
        </div>

        {/* Middle area */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-10">
            {navigationLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    active={link.active}
                    href={link.href}
                    className="text-foreground hover:text-primary active:text-primary flex-row items-center gap-2 py-1.5 font-medium"
                  >
                    <span>{link.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}