'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@workspace/ui/components/button';
import {
  META_THEME_COLORS,
  useMetaColor,
} from '@workspace/ui/hooks/use-meta-color';
import { cn } from '@workspace/ui/lib/utils';

export function ModeSwitcher({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    setMetaColor(
      resolvedTheme === 'dark'
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('group/toggle size-7', className)}
      onClick={toggleTheme}
      {...props}
    >
      <SunIcon className="hidden [html.dark_&]:block" />
      <MoonIcon className="hidden [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
