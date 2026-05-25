'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MemoryCard } from '@/components/shared/MemoryCard';
import {
  Activity,
  Brain,
  TrendingUp,
  Clock,
  PlusCircle,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Memory {
  id: string;
  content: string;
  created_at: string;
  metadata?: {
    type?: string;
  };
}

const mockActivityData = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 7 },
  { name: 'Wed', value: 5 },
  { name: 'Thu', value: 8 },
  { name: 'Fri', value: 12 },
  { name: 'Sat', value: 9 },
  { name: 'Sun', value: 10 },
];

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
        { event: 'INSERT', schema: 'public', table: 'memory_entries' },
        () => queryClient.invalidateQueries({ queryKey: ['memories'] })
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, queryClient]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI memory is synchronized and healthy
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg glass-indigo hover:bg-indigo-500/20 transition-colors">
            <PlusCircle className="w-4 h-4" /> New Interaction
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Brain} label="Memory Score" value="94%" color="text-indigo-400" />
        <StatCard icon={Activity} label="Weekly Insights" value="12" color="text-emerald-400" />
        <StatCard icon={TrendingUp} label="Match Quality" value="High" color="text-indigo-400" />
        <StatCard icon={Clock} label="Last Updated" value="2m ago" color="text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 p-6 rounded-2xl glass space-y-6"
        >
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Interaction Frequency
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockActivityData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Memories Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" /> Memory Pulse
          </h3>
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              [1,2,3].map(i => <div key={i} className="h-24 w-full bg-white/5 rounded-lg animate-pulse" />)
            ) : memories?.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">No memories recorded yet.</p>
            ) : (
              memories?.map((memory) => (
                <MemoryCard key={memory.id} content={memory.content} createdAt={memory.created_at} type={memory.metadata?.type || 'insight'} />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: LucideIcon, label: string, value: string, color: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl glass flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </motion.div>
  );
}
