'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a concise project summary for a client.
 *
 * It includes:
 * - `generateProjectSummary`: An async function that takes a client's name and project details as input and returns a summary of the projects.
 * - `ProjectSummaryInput`: The input type for the `generateProjectSummary` function.
 * - `ProjectSummaryOutput`: The output type for the `generateProjectSummary` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectSummaryInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  projectDetails: z.string().describe('Detailed information about the client\'s projects.'),
});

export type ProjectSummaryInput = z.infer<typeof ProjectSummaryInputSchema>;

const ProjectSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the client\'s projects.'),
  progress: z.string().describe('A short, one-sentence summary of the project.'),
});

export type ProjectSummaryOutput = z.infer<typeof ProjectSummaryOutputSchema>;

export async function generateProjectSummary(input: ProjectSummaryInput): Promise<ProjectSummaryOutput> {
  return generateProjectSummaryFlow(input);
}

const projectSummaryPrompt = ai.definePrompt({
  name: 'projectSummaryPrompt',
  input: {schema: ProjectSummaryInputSchema},
  output: {schema: ProjectSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with generating concise project summaries for software development clients. 

  Given the client's name and their project details, create a brief summary (under 100 words) that captures the current status and key highlights of their projects.

  Client Name: {{{clientName}}}
  Project Details: {{{projectDetails}}}

  Summary: `,
});

const generateProjectSummaryFlow = ai.defineFlow(
  {
    name: 'generateProjectSummaryFlow',
    inputSchema: ProjectSummaryInputSchema,
    outputSchema: ProjectSummaryOutputSchema,
  },
  async input => {
    const {output} = await projectSummaryPrompt(input);
    // Add a one-sentence summary of the generated summary as the progress.
    const progressSummary = `Generated a concise summary of the projects for ${input.clientName}.`;
    return {
      summary: output!.summary,
      progress: progressSummary,
    };
  }
);
