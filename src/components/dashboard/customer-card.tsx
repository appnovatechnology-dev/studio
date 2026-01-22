'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoreHorizontal, Eye, Copy, Edit, Trash2, BrainCircuit } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { GenerateSummaryDialog } from './generate-summary-dialog';

type CustomerCardProps = {
  customer: Customer;
  onDelete: () => void;
};

export function CustomerCard({ customer, onDelete }: CustomerCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const db = useFirestore();
  const publicUrl = `${window.location.origin}/c/${customer.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: 'Copied!',
      description: 'Public link has been copied to your clipboard.',
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'customers', customer.id));
      toast({
        title: 'Customer Deleted',
        description: `${customer.name} has been removed successfully.`,
      });
      onDelete();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete customer.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage asChild src={customer.avatarUrl} alt={customer.name}>
                <Image src={customer.avatarUrl} alt={customer.name} width={48} height={48} data-ai-hint="person portrait" />
            </AvatarImage>
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="font-headline">{customer.name}</CardTitle>
            <CardDescription>{customer.email}</CardDescription>
          </div>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/c/${customer.id}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" /> View Public Page
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => setIsSummaryDialogOpen(true)}>
                  <BrainCircuit className="mr-2 h-4 w-4" /> Generate Summary
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/admin/${customer.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Projects
                  </Link>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the customer and all associated project data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground">
            {customer.projects.length} project(s)
          </p>
        </CardContent>
      </Card>
      <GenerateSummaryDialog customer={customer} open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen} />
    </>
  );
}
