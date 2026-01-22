'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Milestone } from '@/lib/types';

type MilestoneItemProps = {
  milestone: Milestone;
  onToggle: (id: string, completed: boolean) => void;
};

export function MilestoneItem({ milestone, onToggle }: MilestoneItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={milestone.id}
        checked={milestone.completed}
        onCheckedChange={(checked) => onToggle(milestone.id, !!checked)}
      />
      <Label
        htmlFor={milestone.id}
        className={`text-sm ${milestone.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
      >
        {milestone.name}
      </Label>
    </div>
  );
}
