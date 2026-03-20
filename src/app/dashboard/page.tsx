'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Project } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/providers/AuthProvider';

export default function DashboardPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await api.get<Project[]>('/api/projects');
        const items = Array.isArray(data) ? data : [];
        setProjects(items);
        setStatus('ready');
      } catch (_error) {
        setStatus('error');
      }
    };

    if (!authLoading && isAuthenticated) {
      void loadProjects();
    }
  }, [authLoading, isAuthenticated]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-secondary">Welcome to ProjectFlow. Keep your projects moving forward.</p>

      {authLoading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-secondary">
          <Spinner /> Checking your session...
        </div>
      )}

      {!authLoading && !isAuthenticated && (
        <p className="mt-6 text-sm text-error">Please sign in to view your dashboard.</p>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Active projects</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{projects.length}</p>
            <p>Across your workspace.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Next milestone</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Create and track milestones for every project.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Insights</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm">See AI recommendations and team capacity at a glance.</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Link href="/dashboard/projects" className="text-sm font-semibold text-primary hover:underline">
          View all projects →
        </Link>
      </div>
      {status === 'loading' && isAuthenticated && (
        <div className="mt-6 flex items-center gap-2 text-sm text-secondary">
          <Spinner /> Loading projects...
        </div>
      )}
      {status === 'error' && <p className="mt-6 text-error">Unable to load projects. Try again.</p>}
      {status === 'ready' && projects.length === 0 && (
        <p className="mt-6 text-secondary">No projects yet. Create one to get started.</p>
      )}
    </main>
  );
}
