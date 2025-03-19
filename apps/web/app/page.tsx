import { getCurrentUser } from '@/lib/server/auth';
import HomePage from './home/page';

export default async function Home() {
  // if already logged in, render the dashboard page
  // else render the home page
  const user = await getCurrentUser();
  if (user) {
    return <p>{user.username}</p>;
  }
  return <HomePage />;
}
