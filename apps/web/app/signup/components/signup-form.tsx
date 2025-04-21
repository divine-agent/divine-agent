import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';
import type React from 'react';

export function SignupForm({
  signupAction,
  className,
  ...props
}: {
  signupAction: (formData: FormData) => void;
} & React.ComponentPropsWithoutRef<'form'>) {
  return (
    <form
      id="signup-form"
      action={signupAction}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">Sign up to Divine Agent</h1>
        <p className="text-balance text-muted-foreground text-sm">
          Create your free account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" type="email" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input name="password" id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input name="username" id="username" type="text" required />
        </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <a href="/login" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </form>
  );
}
