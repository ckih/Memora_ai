'use client';

import { useQuery } from '@tanstack/react-query';
import { MatchCard } from '@/components/shared/MatchCard';
import { createClient } from '@/utils/supabase/client';

interface Match {
  score: number;
  explanation: string;
  title: string;
  company: string;
}

export default function MatchesPage() {
  const supabase = createClient();

  const { data: matches, isLoading, error } = useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ job_description: 'Software Engineer at a high-growth AI startup' }),
      });
      return await response.json();
    },
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Opportunity Matches</h1>
      {isLoading ? (
        <p>Finding the best matches for you...</p>
      ) : error ? (
        <p className="text-destructive">Failed to load matches.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches?.map((match, i) => (
            <MatchCard key={i} {...match} />
          ))}
        </div>
      )}
    </div>
  );
}
