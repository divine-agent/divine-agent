import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';

export default function Home() {
  return (
    <Link href="/login">
      <Button>Login</Button>
    </Link>
  );
}
