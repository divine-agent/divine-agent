import { getCurrentUser } from '@/lib/server/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <p>{user?.username}</p>
    </>
  );
}
