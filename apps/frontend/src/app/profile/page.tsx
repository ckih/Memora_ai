'use client';

import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { User, Shield, Target, Compass, Zap, LucideIcon } from 'lucide-react';

const preferenceData = [
  { subject: 'Remote-first', A: 120, fullMark: 150 },
  { subject: 'Compensation', A: 98, fullMark: 150 },
  { subject: 'Growth', A: 86, fullMark: 150 },
  { subject: 'Culture', A: 99, fullMark: 150 },
  { subject: 'Autonomy', A: 85, fullMark: 150 },
  { subject: 'Stack Fit', A: 65, fullMark: 150 },
];

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
          <User className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Your Professional Identity</h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            This visualization represents Memora&apos;s current understanding of your priorities and career trajectory.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-[2rem] glass aspect-square flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 -z-10" />
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={preferenceData}>
              <PolarGrid stroke="#ffffff10" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis hide />
              <Radar
                name="Candidate"
                dataKey="A"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Detailed Insights */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">Memory Dimensions</h3>
            <div className="grid grid-cols-1 gap-4">
              <InsightCard
                icon={Shield}
                title="Security & Stability"
                desc="Preference for Series B+ startups with healthy runways and clear path to profitability."
              />
              <InsightCard
                icon={Target}
                title="Technological Focus"
                desc="Strong inclination towards AI/ML infrastructure, Next.js ecosystems, and distributed systems."
              />
              <InsightCard
                icon={Zap}
                title="Velocity"
                desc="Thrives in high-output environments with established CI/CD and rapid shipping cycles."
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 flex gap-4">
            <Compass className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">AI Recommendation</h4>
              <p className="text-sm text-emerald-100/70 leading-relaxed">
                &ldquo;Based on your recent feedback, I&apos;m prioritizing roles with &apos;Founder-led&apos; cultures and significant equity upside.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) {
  return (
    <motion.div whileHover={{ x: 10 }} className="p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all flex gap-4 group">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
