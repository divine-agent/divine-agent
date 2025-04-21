import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';
import type React from 'react';

export function LoginForm({
  loginAction,
  className,
  ...props
}: {
  loginAction: (formData: FormData) => void;
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form id="login-form" action={loginAction}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex items-center justify-center rounded-md text-2xl">
                😇
              </div>
              <span className="sr-only">Divine Agent.</span>
            </a>
            <h1 className="font-bold text-xl">Welcome to Divine Agent.</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <a
                href="/signup?source=login"
                className="underline underline-offset-4"
              >
                Sign up
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="identity">Username or email address</Label>
              <Input
                name="identity"
                id="identity"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="username"
                autoFocus={true}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
