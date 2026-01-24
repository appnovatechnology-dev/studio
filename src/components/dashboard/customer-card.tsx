'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Eye, Copy, Edit, Trash2, Building, BrainCircuit } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useFirestore, deleteDocumentNonBlocking } from '@/firebase';
import type { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { GenerateSummaryDialog } from './generate-summary-dialog';

type CustomerCardProps = {
  customer: Customer;
};

export function CustomerCard({ customer }: CustomerCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  const copyToClipboard = () => {
    const publicUrl = `${window.location.origin}/c/${customer.id}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: 'Copied!',
      description: 'Public link has been copied to your clipboard.',
    });
  };

  const handleDelete = () => {
    if (!db) return;
    const docRef = doc(db, 'customers', customer.id);
    deleteDocumentNonBlocking(docRef);
    setShowDeleteAlert(false);
    toast({
      title: 'Customer Deleted',
      description: `${customer.name} has been removed successfully.`,
    });
  };

  return (
    <Card className="flex flex-col">
      <GenerateSummaryDialog
        customer={customer}
        open={showSummaryDialog}
        onOpenChange={setShowSummaryDialog}
      />
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer and all associated project data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <Building className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <CardTitle className="font-headline">{customer.name}</CardTitle>
          <CardDescription>{customer.email}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setShowSummaryDialog(true)}>
                <BrainCircuit className="mr-2 h-4 w-4" /> Generate Summary
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/c/${customer.id}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" /> View Public Page
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" /> Copy Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/${customer.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Projects
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setShowDeleteAlert(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
          <p className="text-sm text-muted-foreground">
              Customer Code: <span className="font-mono text-foreground">{customer.customerCode}</span>
          </p>
        <p className="text-sm text-muted-foreground">
          {customer.projects.length} project(s)
        </p>
      </CardContent>
    </Card>
  );
}
