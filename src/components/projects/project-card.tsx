'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, PlusCircle, MoreHorizontal, BrainCircuit } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import type { Project, Milestone, Update, ProjectStatus } from '@/lib/types';
import { projectStatuses } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MilestoneItem } from './milestone-item';
import { UpdateItem } from './update-item';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GenerateProjectSummaryDialog } from './generate-project-summary-dialog';

const milestoneSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Milestone name cannot be empty.'),
  completed: z.boolean(),
});

const updateSchema = z.object({
  id: z.string(),
  date: z.custom<Timestamp>(),
  title: z.string().min(1, 'Update title cannot be empty.'),
  description: z.string(),
});

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  description: z.string(),
  status: z.enum(projectStatuses),
  milestones: z.array(milestoneSchema),
  updates: z.array(updateSchema),
});

type ProjectCardProps = {
  project: Project;
  onSave: (updatedProject: Project) => Promise<void>;
  onDelete: (projectId: string) => Promise<void>;
};

export function ProjectCard({ project, onSave, onDelete }: ProjectCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      ...project,
      status: project.status || 'Prototyping',
    },
  });

  // Sync form with external project data changes
  useEffect(() => {
    form.reset({
      ...project,
      status: project.status || 'Prototyping',
    });
  }, [project, form]);

  const { fields: milestones, append: appendMilestone, remove: removeMilestone } = useFieldArray({
    control: form.control,
    name: 'milestones',
  });

  const { fields: updates, append: appendUpdate, remove: removeUpdate } = useFieldArray({
    control: form.control,
    name: 'updates',
  });

  const watchedMilestones = form.watch('milestones');
  const progress = useMemo(() => {
    const completedMilestones = watchedMilestones.filter(m => m.completed).length;
    const totalMilestones = watchedMilestones.length;
    return totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  }, [watchedMilestones]);

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    setIsSaving(true);
    const updatedData = { ...data, progress: Math.round(progress) };
    await onSave({ ...project, ...updatedData });
    setIsSaving(false);
    // form.reset(updatedData) has been removed to prevent race conditions.
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    await onDelete(project.id);
    // Component will be unmounted by parent
  };
  
  const handleMilestoneToggle = (id: string, completed: boolean) => {
    const index = milestones.findIndex(m => m.id === id);
    if (index > -1) {
      form.setValue(`milestones.${index}.completed`, completed, { shouldDirty: true });
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="text-xl font-headline font-bold border-0 shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} className="text-sm text-muted-foreground border-0 shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <GenerateProjectSummaryDialog project={project}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <BrainCircuit className="mr-2 h-4 w-4" /> Generate Summary
                    </DropdownMenuItem>
                  </GenerateProjectSummaryDialog>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the '{project.name}' project. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProject} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Status</Label>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <div className="space-y-2">
                <Label>Progress</Label>
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}% complete</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold">Milestones</h4>
              <div className="space-y-2">
                {milestones.map((milestone, index) => (
                  <MilestoneItem key={milestone.id} milestone={milestone} onToggle={handleMilestoneToggle} />
                ))}
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <h4 className="font-semibold">Updates</h4>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => appendUpdate({ id: uuidv4(), date: Timestamp.now(), title: '', description: '' }, { shouldFocus: true })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Update
                </Button>
              </div>
              <div className="space-y-4">
                 {updates.map((update, index) => (
                    <UpdateItem key={update.id} index={index} onDelete={() => removeUpdate(index)} />
                ))}
              </div>
            </div>
          </CardContent>

          <div className="p-6 pt-0">
             <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
