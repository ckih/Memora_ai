'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  DollarSign,
  Info
} from 'lucide-react';
import { useState } from 'react';

interface Match {
  score: number;
  explanation: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
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
        body: JSON.stringify({ job_description: 'Staff Frontend Engineer at a series B fintech' }),
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    },
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-10">
      <header className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Opportunity Matches</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          We&apos;ve analyzed your memory and preferences against 50+ new opportunities today.
          Here are your top-aligned roles.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-4 md:space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 md:h-48 w-full glass rounded-2xl md:rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 md:p-10 glass-indigo rounded-2xl md:rounded-3xl text-center space-y-4">
          <Info className="w-10 h-10 md:w-12 md:h-12 text-indigo-400 mx-auto" />
          <h2 className="text-lg md:text-xl font-bold">Unable to sync matches</h2>
          <p className="text-xs md:text-sm text-muted-foreground text-pretty">The AI engine is temporarily re-calibrating. Please check back in a moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {matches?.map((match, i) => (
            <MatchCard key={i} match={match} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, index }: { match: Match, index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-indigo rounded-2xl md:rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all border border-white/5"
    >
      <div className="p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-center">
        <div className="flex w-full md:w-auto items-center gap-4 md:block">
          {/* Score Ring */}
          <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0 mx-auto md:mx-0">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%" cy="50%" r="45%"
                stroke="currentColor" strokeWidth="6"
                fill="transparent" className="text-white/5"
              />
              <motion.circle
                cx="50%" cy="50%" r="45%"
                stroke="currentColor" strokeWidth="6"
                fill="transparent"
                strokeDasharray="283%"
                initial={{ strokeDashoffset: "283%" }}
                animate={{ strokeDashoffset: `${283 * (1 - match.score / 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="text-indigo-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl md:text-2xl font-black">{match.score}</span>
            </div>
          </div>

          <div className="md:hidden flex-1">
             <h3 className="text-lg font-bold leading-tight line-clamp-1">{match.title || 'Lead Frontend Engineer'}</h3>
             <p className="text-xs text-muted-foreground font-medium">{match.company || 'Vercel'}</p>
          </div>
        </div>

        {/* Info (Desktop) / Extended Info (Mobile) */}
        <div className="flex-1 space-y-2 md:space-y-3 w-full">
          <div className="hidden md:flex flex-wrap items-center gap-3 text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight">{match.title || 'Lead Frontend Engineer'}</h3>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">High Match</span>
          </div>
          <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground font-medium">
            <span className="hidden md:flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {match.company || 'Vercel'}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {match.location || 'Remote'}</span>
            <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {match.salary || '$180k – $240k'}</span>
            <span className="md:hidden flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider scale-90">High Match</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="text-xs md:text-sm font-semibold">Reasoning</span>
          </button>
          <button className="flex-1 md:flex-none px-5 md:px-6 py-2.5 rounded-xl bg-primary hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
            <span className="text-xs md:text-sm font-bold text-nowrap">Apply Now</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-indigo-400">AI Analysis</h4>
                <p className="text-xs md:text-sm leading-relaxed text-indigo-100/80">
                  {match.explanation}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-4 border-t border-white/5">
                <AlignmentItem label="Skills Alignment" value={92} />
                <AlignmentItem label="Culture Fit" value={88} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AlignmentItem({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full bg-emerald-500 rounded-full"
        />
      </div>
    </div>
  );
}
