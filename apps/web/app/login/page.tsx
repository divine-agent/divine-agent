import { LoginForm } from '@/components/login-form';
import { getClient } from '@/hooks/apolloClient';
import {
  LoginDocument,
  type LoginMutationVariables,
} from '@workspace/graphql-client/src/auth/login.generated';
import { cookies } from 'next/headers';

export default function LoginPage() {
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
    if (data?.success) {
      const cookie = await cookies();
      // TODO set properties of cookie
      data?.data && cookie.set('token', data?.data);
    } else {
      console.error(`Login failed: [${data?.code}] ${data?.message}`);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm loginAction={login} />
      </div>
    </div>
  );
}
