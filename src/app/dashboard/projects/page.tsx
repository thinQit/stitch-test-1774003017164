'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/providers/AuthProvider';

export default function ProjectsPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [editing, setEditing] = useState<Project | null>(null);

  const loadProjects = async () => {
    setStatus('loading');
    try {
      const data = await api.get<Project[]>('/api/projects');
      const items = Array.isArray(data) ? data : [];
      setProjects(items);
      setStatus('ready');
    } catch (_error) {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      void loadProjects();
    }
  }, [authLoading, isAuthenticated]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (editing?.id) {
        await api.put<{ success: boolean; project?: Project }>(`/api/projects/${editing.id}`, form);
      } else {
        await api.post<{ success: boolean; project: Project }>('/api/projects', form);
      }
      setForm({ title: '', description: '', dueDate: '' });
      setEditing(null);
      await loadProjects();
    } catch (_error) {
      setStatus('error');
    }
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title || '',
      description: project.description || '',
      dueDate: project.dueDate || ''
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete<{ success: boolean }>(`/api/projects/${id}`);
      await loadProjects();
    } catch (_error) {
      setStatus('error');
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Projects</h1>
      <p className="mt-2 text-secondary">Create, track, and update every initiative in one place.</p>

      {authLoading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-secondary">
          <Spinner /> Checking your session...
        </div>
      )}

      {!authLoading && !isAuthenticated && (
        <p className="mt-6 text-sm text-error">Please sign in to manage your projects.</p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-lg border border-border bg-white p-6">
        <h2 className="text-lg font-semibold">{editing ? 'Edit project' : 'Create a new project'}</h2>
        <Input
          label="Title"
          required
          value={form.title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: event.target.value })}
        />
        <Input
          label="Description"
          value={form.description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, description: event.target.value })
          }
        />
        <Input
          label="Due date"
          type="date"
          value={form.dueDate}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, dueDate: event.target.value })}
        />
        <div className="flex gap-3">
          <Button type="submit">{editing ? 'Save changes' : 'Create project'}</Button>
          {editing && (
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="mt-8">
        {status === 'loading' && isAuthenticated && (
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Spinner /> Loading projects...
          </div>
        )}
        {status === 'error' && <p className="text-error">Unable to load projects.</p>}
        {status === 'ready' && projects.length === 0 && (
          <p className="text-secondary">No projects yet. Create your first project above.</p>
        )}
        {projects.length > 0 && (
          <div className="mt-4 grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="rounded-lg border border-border bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                    <p className="text-sm text-secondary">{project.description || 'No description provided.'}</p>
                  </div>
                  <Badge variant="success">{project.status || 'active'}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
                  <span>
                    Due:{' '}
                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
