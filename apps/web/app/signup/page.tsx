import { getClient } from '@/hooks/apolloClient';
import {
  SignupDocument,
  type SignupMutationVariables,
} from '@workspace/graphql-client/src/auth/user.generated';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { SignupForm } from './components/signup-form';

/**
 * Signup action with graphql mutation to create user
 * @description redirect to login page if signup success
 * @param formData
 */
async function signup(formData: FormData) {
  'use server';
  const variables: SignupMutationVariables = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    username: formData.get('username') as string,
  };
  const data = (
    await getClient().mutate({
      mutation: SignupDocument,
      variables,
    })
  ).data?.createUser;
  if (data?.success) {
    redirect('/login');
  } else {
    console.error(`Signup failed: [${data?.code}] ${data?.message}`);
  }
}

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex items-center justify-center text-xl">😇</div>
            Divine Agent.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm signupAction={signup} />
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex lg:items-center lg:justify-center">
        <Image
          priority={true}
          src="/peeking-angel.png"
          width={200}
          height={200}
          alt="Image"
          className="dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
