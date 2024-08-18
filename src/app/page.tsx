import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col gap-4 items-center justify-center h-screen">
      <h1 className="text-lg font-bold">Welcome to your app</h1>
      <Button asChild>
        <Link href="/auth/login">Get started</Link>
      </Button>
    </main>
  );
}
