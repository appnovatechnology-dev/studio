'use client';

import { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { generateProjectSummary } from '@/ai/flows/generate-project-summary';
import type { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

type GenerateSummaryDialogProps = {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GenerateSummaryDialog({ customer, open, onOpenChange }: GenerateSummaryDialogProps) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const projectDetails = customer.projects.map(p => 
        `Project: ${p.name} (Status: ${p.status}, Progress: ${p.progress}%). Description: ${p.description}`
      ).join('\n');

      const result = await generateProjectSummary({
        clientName: customer.name,
        projectDetails: projectDetails || 'No projects found.',
      });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred while generating the summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Project Summary for {customer.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a concise summary of all projects for this customer using Genkit AI.
          </p>
          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            <BrainCircuit className="mr-2 h-4 w-4" />
            {loading ? 'Generating...' : 'Generate Summary'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}

          {summary && !loading && (
             <div className="pt-4">
                <h3 className="font-semibold mb-2">Generated Summary:</h3>
                <p className="text-sm rounded-md border bg-secondary/50 p-4 leading-relaxed">{summary}</p>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
