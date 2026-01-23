'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a concise summary for a single project.
 *
 * It includes:
 * - `generateProjectSummary`: An async function that takes project details as input and returns a summary.
 * - `ProjectSummaryInput`: The input type for the `generateProjectSummary` function.
 * - `ProjectSummaryOutput`: The output type for the `generateProjectSummary` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectSummaryInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectDescription: z.string().describe('A short description of the project.'),
  projectStatus: z.string().describe('The current status of the project.'),
  projectProgress: z.number().describe('The percentage of project completion.'),
  projectMilestones: z.string().describe("A list of the project's milestones and their completion status."),
});

export type ProjectSummaryInput = z.infer<typeof ProjectSummaryInputSchema>;

const ProjectSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the project.'),
  progress: z.string().describe('A short, one-sentence summary of the generation task.'),
});

export type ProjectSummaryOutput = z.infer<typeof ProjectSummaryOutputSchema>;

export async function generateProjectSummary(input: ProjectSummaryInput): Promise<ProjectSummaryOutput> {
  return generateProjectSummaryFlow(input);
}

const projectSummaryPrompt = ai.definePrompt({
  name: 'projectSummaryPrompt',
  input: {schema: ProjectSummaryInputSchema},
  output: {schema: ProjectSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with generating a concise project summary.

  Given the project's details, create a brief summary (under 100 words) that captures the current status and key highlights.

  Project Name: {{{projectName}}}
  Description: {{{projectDescription}}}
  Status: {{{projectStatus}}}
  Progress: {{{projectProgress}}}%
  Milestones:
{{{projectMilestones}}}

  Generate a human-readable summary based on this data.`,
});

const generateProjectSummaryFlow = ai.defineFlow(
  {
    name: 'generateProjectSummaryFlow',
    inputSchema: ProjectSummaryInputSchema,
    outputSchema: ProjectSummaryOutputSchema,
  },
  async input => {
    const {output} = await projectSummaryPrompt(input);
    const progressSummary = `Generated a concise summary for the project: ${input.projectName}.`;
    return {
      summary: output!.summary,
      progress: progressSummary,
    };
  }
);
