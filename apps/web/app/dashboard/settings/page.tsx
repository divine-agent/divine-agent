import { ProfileForm } from './components/profile-form';
import { getCurrentUser } from '@/lib/server/auth';
import { Separator } from '@workspace/ui/components/separator';

export default async function SettingsProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg">Profile</h3>
        <p className="text-muted-foreground text-sm">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm user={user} />
    </div>
  );
}
