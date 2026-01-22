'use client';

import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Update } from '@/lib/types';

type UpdateItemProps = {
  update: Update;
  onDelete: (id: string) => void;
};

export function UpdateItem({ update, onDelete }: UpdateItemProps) {
  return (
    <div className="relative pl-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{update.title}</p>
          <p className="text-sm text-muted-foreground">{update.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(update.date.toDate(), 'MMMM d, yyyy')}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(update.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
