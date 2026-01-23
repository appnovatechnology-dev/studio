'use client';

import { format } from 'date-fns';
import { CheckCircle, Circle, Rocket, Building } from 'lucide-react';
import type { Customer, Project, Update } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

function ProjectUpdatesTimeline({ updates }: { updates: Update[] }) {
  const sortedUpdates = [...updates].sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());

  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3"></div>
      {sortedUpdates.map((update, index) => (
        <div key={update.id} className="relative mb-8">
          <div className="absolute left-0 top-1 h-5 w-5 bg-background border-2 border-primary rounded-full flex items-center justify-center -translate-x-1/2 ml-0.5">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
          </div>
          <div className="pl-8">
            <p className="text-xs text-muted-foreground">{format(update.date.toDate(), 'MMMM d, yyyy')}</p>
            <p className="font-semibold">{update.title}</p>
            <p className="text-sm text-muted-foreground">{update.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PublicProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
            </div>
            <Badge variant={project.status === 'Deployed' ? 'default' : 'secondary'} className={project.status === 'Deployed' ? 'bg-green-600' : ''}>
              {project.status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Progress value={project.progress} />
          <p className="text-xs text-muted-foreground mt-2 text-right">{Math.round(project.progress)}% Complete</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
            <div>
                <h4 className="font-semibold mb-3">Milestones</h4>
                <div className="space-y-3">
                    {project.milestones.map(milestone => (
                        <div key={milestone.id} className="flex items-center">
                            {milestone.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                                <Circle className="h-5 w-5 text-muted-foreground mr-2" />
                            )}
                            <span className={milestone.completed ? 'text-muted-foreground line-through' : ''}>
                                {milestone.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-semibold mb-3">Recent Updates</h4>
                <ProjectUpdatesTimeline updates={project.updates} />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}


export function PublicProjectView({ customer }: { customer: Customer }) {
  return (
    <div className="container py-8 md:py-12">
      <header className="text-center mb-12">
        <div className="h-24 w-24 mx-auto mb-4 border-4 border-background ring-2 ring-primary rounded-full flex items-center justify-center bg-muted">
            <Building className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold">Project Progress for {customer.name}</h1>
        <p className="text-muted-foreground mt-2">Here is a live look at the status of your projects.</p>
      </header>

      <main className="space-y-8">
        {customer.projects.length > 0 ? (
          customer.projects.map(project => (
            <PublicProjectCard key={project.id} project={project} />
          ))
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <h2 className="text-xl font-semibold">No Projects Yet</h2>
              <p className="text-muted-foreground mt-2">Projects will appear here once they are added.</p>
            </CardContent>
          </Card>
        )}
      </main>
      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p className="flex items-center justify-center">Powered by <Rocket className="h-4 w-4 mx-1.5 text-primary" /> ProjectView</p>
      </footer>
    </div>
  );
}

    