'use client';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Button } from '@workspace/ui/components/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@workspace/ui/components/navigation-menu';
import Link from 'next/link';

export default function HomeHeader() {
  const navigationItems = [
    {
      title: 'Divine Agent',
      href: '/',
      description: 'Home page',
    },
  ];

  return (
    <header className="fixed top-0 left-0 z-40 w-full bg-sidebar/50 backdrop-blur-md">
      <div className="container relative mx-auto flex min-h-16 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
          <NavigationMenu className="flex items-start justify-start">
            <NavigationMenuList className="flex flex-row justify-start gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Button variant="ghost" asChild>
                    <NavigationMenuLink href={item.href}>
                      {item.title}
                    </NavigationMenuLink>
                  </Button>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex px-2 lg:justify-center">
          <Link href="/">
            <p className="text-2xl">😇</p>
          </Link>
        </div>
        <div className="flex w-full justify-end gap-4 px-2">
          <Link href="https://github.com/Kaikaikaifang/divine-agent">
            <SiGithub />
          </Link>
        </div>
      </div>
    </header>
  );
}
