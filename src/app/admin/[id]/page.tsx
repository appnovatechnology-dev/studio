'use client';
import { use } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Header } from '@/components/header';
import { ProjectDetails } from '@/components/projects/project-details';

type AdminPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function AdminPage({ params }: AdminPageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <ProjectDetails customerId={resolvedParams.id} />
        </main>
      </div>
    </AuthGuard>
  );
}
