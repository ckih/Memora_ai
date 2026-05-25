'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { Send, Bot, User, Sparkles, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Memora AI agent. I'm here to build your professional memory. Tell me about your ideal next role or any feedback on recent interviews." },
  ]);
  const [input, setInput] = useState('');
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
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === 'user' ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                }`}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl max-w-[70%] text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'glass rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {mutation.isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="glass p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AI is learning...</span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-6 bg-gradient-to-t from-[#0a0f1e] to-transparent">
          <form
            className="relative max-w-4xl mx-auto"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input
              placeholder="Tell Memora about your preferences..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={mutation.isPending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || mutation.isPending}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-center mt-3 text-muted-foreground/40 uppercase tracking-[0.2em]">
            Encrypted End-to-End • Powered by Memora Engine v1
          </p>
        </div>
      </div>

      {/* Insight Sidebar (Hidden on small screens) */}
      <div className="hidden xl:flex w-80 border-l border-white/5 bg-black/20 flex-col p-6 space-y-8">
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
      </div>
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
