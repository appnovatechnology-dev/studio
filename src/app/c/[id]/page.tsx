'use client';

import { useState, useEffect, use } from 'react';
import { doc, onSnapshot, DocumentSnapshot, DocumentData, FirestoreError } from 'firebase/firestore';
import { useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import type { Customer } from '@/lib/types';
import { PublicProjectView } from '@/components/projects/public-project-view';
import { Skeleton } from '@/components/ui/skeleton';

type PublicCustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
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
  const resolvedParams = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const db = useFirestore();

  useEffect(() => {
    if (!resolvedParams?.id || !db) {
        setLoading(false);
        setError(true);
        return;
    }
    const docRef = doc(db, 'customers', resolvedParams.id);
    const unsubscribe = onSnapshot(docRef,
      (docSnap: DocumentSnapshot<DocumentData>) => {
        if (docSnap.exists()) {
          setCustomer({ id: docSnap.id, ...docSnap.data() } as Customer);
          setError(false);
        } else {
          setError(true);
        }
        setLoading(false);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
            path: `customers/${resolvedParams.id}`,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(true);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [resolvedParams?.id, db]);

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
