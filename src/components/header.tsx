'use client';

import { LogOut, Rocket } from 'lucide-react';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function Header() {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Rocket className="mr-2 h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold">ProjectView</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
