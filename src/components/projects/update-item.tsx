'use client';

import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type UpdateItemProps = {
  index: number;
  onDelete: () => void;
};

export function UpdateItem({ index, onDelete }: UpdateItemProps) {
  const { control, watch } = useFormContext();
  const dateValue = watch(`updates.${index}.date`);
  // The date might not exist if it's a new item, so we handle that.
  const date = dateValue ? dateValue.toDate() : new Date();

  return (
    <div className="relative pl-4 border-l space-y-2">
      <div className="flex justify-between items-start">
        <p className="text-xs text-muted-foreground pt-2">
          {format(date, 'MMMM d, yyyy')}
        </p>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" type="button" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <FormField
        control={control}
        name={`updates.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Update title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`updates.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea placeholder="Describe the update." {...field} rows={2} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
