import { getClient } from '@/hooks/apolloClient';
import { setSessionTokenCookie } from '@/lib/server/cookies';
import { LoginDocument } from '@workspace/graphql-client/src/auth/login.generated';
import type { LoginMutationVariables } from '@workspace/graphql-client/src/auth/login.generated';
import { redirect } from 'next/navigation';
import { LoginForm } from './components/login-form';

/**
 * Login action with graphql mutation
 * @description set token to cookie if login success
 * @param formData
 */
async function login(formData: FormData) {
  'use server';

  const variables: LoginMutationVariables = {
    identity: formData.get('identity') as string,
    password: formData.get('password') as string,
  };
  const data = (
    await getClient().mutate({
      mutation: LoginDocument,
      variables,
    })
  ).data?.login;
  if (data?.data) {
    // set the expiredAt of cookie to 7 day
    // which will refresh in middleware
    await setSessionTokenCookie(data.data, new Date(Date.now() + 7 * 864e5));
    redirect('/');
  } else {
    console.error(`Login failed: [${data?.code}] ${data?.message}`);
  }
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm loginAction={login} />
      </div>
    </div>
  );
}
