import { AccountForm } from '@/components/account-form';
import { getCurrentUser } from '@/lib/server/auth';
import { Separator } from '@workspace/ui/components/separator';

export default async function SettingsAccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg">Account</h3>
        <p className="text-muted-foreground text-sm">
          Update your account settings.
        </p>
      </div>
      <Separator />
      <AccountForm user={user} />
    </div>
  );
}
