'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Memora AI agent. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');

  const mutation = useMutation({
    mutationFn: async (history: Message[]) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/memory/reflect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(history),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.summary }]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    mutation.mutate(newMessages);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg max-w-[80%] ${
              m.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
            }`}
          >
            {m.content}
          </div>
        ))}
        {mutation.isPending && (
          <div className="bg-muted p-4 rounded-lg max-w-[80%] animate-pulse">Thinking...</div>
        )}
      </div>
      <div className="p-4 border-t bg-background">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={mutation.isPending}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
