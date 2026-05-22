import { formatDistanceToNow } from 'date-fns';

export function MemoryCard({ content, createdAt, type }: { content: string, createdAt: string, type: string }) {
  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-full capitalize">{type}</span>
        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(createdAt))} ago</span>
      </div>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}
