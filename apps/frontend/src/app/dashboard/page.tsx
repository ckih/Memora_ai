'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MemoryCard } from '@/components/shared/MemoryCard';

interface Memory {
  id: string;
  content: string;
  created_at: string;
  metadata?: {
    type?: string;
  };
}

export default function DashboardPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: memories, isLoading } = useQuery<Memory[]>({
    queryKey: ['memories'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/memory`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await response.json();
      return data.memories;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'memory_entries',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['memories'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
          <p className="text-muted-foreground">Your AI profile is summarizing your professional journey.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Memory Timeline</h2>
          <div className="space-y-4">
            {isLoading ? (
              <p>Loading memories...</p>
            ) : (
              memories?.map((memory) => (
                <MemoryCard key={memory.id} content={memory.content} createdAt={memory.created_at} type={memory.metadata?.type || 'memory'} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
