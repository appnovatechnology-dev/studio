import type { Timestamp } from 'firebase/firestore';

export type Milestone = {
  id: string;
  name: string;
  completed: boolean;
};

export type Update = {
  id: string;
  date: Timestamp;
  title: string;
  description: string;
};

export type ProjectStatus = 'Prototyping' | 'Development' | 'Deployed';

export const projectStatuses: ProjectStatus[] = ['Prototyping', 'Development', 'Deployed'];

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  milestones: Milestone[];
  updates: Update[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  projects: Project[];
};
