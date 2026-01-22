'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer } from '@/lib/types';
import { PublicProjectView } from '@/components/projects/public-project-view';
import { Skeleton } from '@/components/ui/skeleton';

type PublicCustomerPageProps = {
  params: {
    id: string;
  };
};

function PageSkeleton() {
    return (
        <div className="container py-12">
            <header className="text-center mb-12 flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-10 w-3/4 max-w-lg mb-2" />
                <Skeleton className="h-5 w-1/2 max-w-md" />
            </header>
            <main className="space-y-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </main>
        </div>
    );
}

export default function PublicCustomerPage({ params }: PublicCustomerPageProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const docRef = doc(db, 'customers', params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCustomer({ id: docSnap.id, ...docSnap.data() } as Customer);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error || !customer) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">404 - Not Found</h1>
        <p className="text-muted-foreground mt-2">The project page you're looking for does not exist.</p>
      </div>
    );
  }

  return <PublicProjectView customer={customer} />;
}
