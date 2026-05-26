'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { Send, Bot, User, Sparkles, BrainCircuit, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Memora AI agent. I'm here to build your professional memory. Tell me about your ideal next role or any feedback on recent interviews." },
  ]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const mutation = useMutation({
    mutationFn: async (history: Message[]) => {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/memory/reflect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(history),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.summary }]);
      toast.success('Memory updated!', {
        description: 'The AI has consolidated this conversation into your profile.',
        icon: <BrainCircuit className="w-4 h-4" />
      });
    },
    onError: () => {
      toast.error('Failed to sync memory. Please try again.');
    }
  });

  const handleSend = () => {
    if (!input.trim() || mutation.isPending) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    mutation.mutate(newMessages);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-0px)] overflow-hidden relative">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="xl:hidden absolute top-4 right-4 z-40 p-2 rounded-lg glass-indigo"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative w-full">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar"
        >
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 md:gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === 'user' ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Bot className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <div className={`p-3 md:p-4 rounded-2xl max-w-[85%] md:max-w-[70%] text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'glass rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {mutation.isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="glass p-3 md:p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/40 rounded-full animate-bounce" />
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider text-nowrap">AI is learning...</span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 md:p-6 bg-gradient-to-t from-[#0a0f1e] to-transparent">
          <form
            className="relative max-w-4xl mx-auto flex gap-2"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input
              placeholder="Tell Memora about your preferences..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-4 md:pl-6 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={mutation.isPending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || mutation.isPending}
              className="rounded-xl bg-primary hover:bg-indigo-600 transition-colors h-11 w-11 md:h-14 md:w-14 shrink-0 shadow-lg shadow-indigo-500/20"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </form>
          <p className="text-[8px] md:text-[10px] text-center mt-3 text-muted-foreground/40 uppercase tracking-[0.2em]">
            Encrypted End-to-End • Powered by Memora Engine v1
          </p>
        </div>
      </div>

      {/* Insight Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || true) && (
          <motion.div
            initial={typeof window !== 'undefined' && window.innerWidth < 1280 ? { x: '100%' } : {}}
            animate={typeof window !== 'undefined' && window.innerWidth < 1280 ? { x: isSidebarOpen ? 0 : '100%' } : {}}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-0 xl:relative xl:inset-auto z-50 xl:z-auto w-full sm:w-80 xl:w-80 h-full border-l border-white/5 bg-[#0a0f1e]/95 xl:bg-black/20 flex flex-col p-6 space-y-8 backdrop-blur-xl xl:backdrop-blur-none",
              !isSidebarOpen && "hidden xl:flex"
            )}
          >
            <div className="flex justify-between items-center xl:hidden">
              <span className="font-bold">Active Insights</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 glass rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-3.3 text-indigo-400" /> Active Insights
              </h3>
              <div className="space-y-4">
                <InsightItem label="Career Goal" value="Senior Product Designer" />
                <InsightItem label="Work Style" value="Async / Remote-first" />
                <InsightItem label="Primary Stack" value="React, Next.js, Framer" />
              </div>
            </div>
            <div className="mt-auto p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
              <p className="text-xs text-indigo-300/70 leading-relaxed italic">
                &ldquo;Memora is currently focused on finding roles that prioritize high creative autonomy and competitive equity packages.&rdquo;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InsightItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
      <p className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
