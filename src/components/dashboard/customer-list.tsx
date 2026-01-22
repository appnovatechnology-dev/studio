'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer } from '@/lib/types';
import { CustomerCard } from './customer-card';
import { AddCustomerDialog } from './add-customer-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = () => {
    const q = query(collection(db, 'customers'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData: Customer[] = [];
      querySnapshot.forEach((doc) => {
        customersData.push({ id: doc.id, ...doc.data() } as Customer);
      });
      setCustomers(customersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching customers: ", error);
      setLoading(false);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchCustomers();
    return () => unsubscribe();
  }, []);

  const handleCustomerChange = () => {
    // The onSnapshot listener will automatically refresh the list.
    // This function is passed to the dialog to trigger any other desired side-effects in the future.
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold">Customers</h1>
        <AddCustomerDialog onCustomerAdded={handleCustomerChange} />
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && customers.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Customers Found</h2>
          <p className="text-muted-foreground mt-2">Get started by adding your first customer.</p>
        </div>
      )}
      
      {!loading && customers.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} onDelete={handleCustomerChange} />
          ))}
        </div>
      )}
    </div>
  );
}
