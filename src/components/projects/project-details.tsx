'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import { type Customer, type Project, type Milestone, type Update, projectStatuses } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard } from './project-card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AddProjectDialog, addProjectFormSchema } from './add-project-dialog';
import type * as z from 'zod';

export function ProjectDetails({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'customers', customerId), (doc) => {
      if (doc.exists()) {
        setCustomer({ id: doc.id, ...doc.data() } as Customer);
      } else {
        // Handle customer not found
        setCustomer(null);
      }
      setLoading(false);
    }, (error) => {
      setLoading(false);
      const permissionError = new FirestorePermissionError({
        path: `customers/${customerId}`,
        operation: 'get',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
    return () => unsub();
  }, [customerId, db]);

  const handleSaveProject = async (updatedProject: Project) => {
    if (!customer) return;
    const customerRef = doc(db, 'customers', customerId);
    const projectIndex = customer.projects.findIndex(p => p.id === updatedProject.id);
    
    const newProjects = [...customer.projects];
    if (projectIndex > -1) {
      newProjects[projectIndex] = updatedProject;
    }

    const updatedData = { projects: newProjects };
    updateDoc(customerRef, updatedData)
      .then(() => {
        toast({ title: "Success", description: `Project "${updatedProject.name}" has been saved.` });
      })
      .catch(() => {
        const permissionError = new FirestorePermissionError({
          path: customerRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };
  
  const handleDeleteProject = async (projectId: string) => {
    if (!customer) return;
    const customerRef = doc(db, 'customers', customerId);
    const newProjects = customer.projects.filter(p => p.id !== projectId);
    const updatedData = { projects: newProjects };
    updateDoc(customerRef, updatedData)
      .then(() => {
        toast({ title: "Project Deleted", description: "The project has been removed." });
      })
      .catch(() => {
        const permissionError = new FirestorePermissionError({
          path: customerRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleAddProject = async (values: z.infer<typeof addProjectFormSchema>) => {
    if (!customer) return;
    setIsAddingProject(true);

    const customerRef = doc(db, 'customers', customerId);

    const newMilestones: Milestone[] = projectStatuses.map((status) => ({
      id: uuidv4(),
      name: status,
      completed: false,
    }));
    const newUpdate: Update = { id: uuidv4(), date: Timestamp.now(), title: 'Project Created', description: 'The project has been initialized.' };

    const newProject: Project = {
      id: uuidv4(),
      name: values.name,
      description: values.description,
      status: 'Prototyping',
      progress: 0,
      milestones: newMilestones,
      updates: [newUpdate]
    };

    const newProjects = [...customer.projects, newProject];
    const updatedData = { projects: newProjects };
    
    updateDoc(customerRef, updatedData)
      .then(() => {
        toast({ title: "Project Added", description: "A new project has been added." });
        setAddProjectDialogOpen(false);
      })
      .catch(() => {
        const permissionError = new FirestorePermissionError({
          path: customerRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsAddingProject(false);
      });
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center py-16">Customer not found.</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">Manage Projects for {customer.name}</h1>
        <p className="text-muted-foreground">Add, edit, and delete projects below.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-2">
        {customer.projects.map(project => (
          <ProjectCard key={project.id} project={project} onSave={handleSaveProject} onDelete={handleDeleteProject} />
        ))}
        <Button variant="outline" className="h-full min-h-[200px] border-2 border-dashed" onClick={() => setAddProjectDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>
       <AddProjectDialog 
        open={isAddProjectDialogOpen} 
        onOpenChange={setAddProjectDialogOpen}
        onAddProject={handleAddProject}
        loading={isAddingProject}
      />
    </div>
  );
}
