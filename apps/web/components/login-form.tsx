import { getClient } from '@/hooks/apolloClient';
import {
  LoginDocument,
  type LoginMutationVariables,
} from '@workspace/graphql-client/src/auth/login.generated';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';
import Form from 'next/form';
import { cookies } from 'next/headers';
import type React from 'react';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  async function login(formData: FormData) {
    'use server';
    const variables: LoginMutationVariables = {
      identity: formData.get('identity') as string,
      password: formData.get('password') as string,
    };
    const data = await getClient().mutate({
      mutation: LoginDocument,
      variables,
    });
    if (data.data?.login.data) {
      const cookie = await cookies();
      cookie.set('token', data.data?.login.data);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Form action={login}>
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
      </Form>
    </div>
  );
}
