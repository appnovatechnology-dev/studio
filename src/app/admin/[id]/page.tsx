'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Header } from '@/components/header';
import { ProjectDetails } from '@/components/projects/project-details';

type AdminPageProps = {
  params: {
    id: string;
  };
};

export default function AdminPage({ params }: AdminPageProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <ProjectDetails customerId={params.id} />
        </main>
      </div>
    </AuthGuard>
  );
}
