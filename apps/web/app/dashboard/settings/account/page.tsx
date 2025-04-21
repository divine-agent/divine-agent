import { AccountForm } from './components/account-form';
import { getClient } from '@/hooks/apolloClient';
import { getCurrentUser } from '@/lib/server/auth';
import { getAuthContext } from '@/lib/server/auth';
import type { ActionState } from '@/lib/types/state';
import type { UpdateAccountMutationVariables } from '@workspace/graphql-client/src/auth/user.generated';
import { UpdateAccountDocument } from '@workspace/graphql-client/src/auth/user.generated';
import { Separator } from '@workspace/ui/components/separator';
import { revalidatePath } from 'next/cache';

async function updateUser(
  id: string,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  'use server';

  const context = await getAuthContext();
  if (!context) {
    return { message: 'Unauthorized', status: 'ERROR' };
  }
  const variables: UpdateAccountMutationVariables = {
    updateUserId: id,
    name: formData.get('name') as string,
  };
  const data = (
    await getClient().mutate({
      mutation: UpdateAccountDocument,
      variables,
      context,
    })
  ).data?.updateUser;

  if (data?.data) {
    revalidatePath('/');
    return { message: 'Account updated', status: 'SUCCESS' };
  }
  return {
    message: data?.message ?? 'Account update failed',
    status: 'ERROR',
  };
}

export default async function SettingsAccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const updateAccountAction = updateUser.bind(null, user.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg">Account</h3>
        <p className="text-muted-foreground text-sm">
          Update your account settings.
        </p>
      </div>
      <Separator />
      <AccountForm user={user} updateAccountAction={updateAccountAction} />
    </div>
  );
}
