export default function AgentPage() {
  return (
    <div className="flex flex-col h-screen max-h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-muted p-4 rounded-lg max-w-[80%]">
          Hello! I&apos;m your Memora AI agent. How can I help you today?
        </div>
      </div>
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <input
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
          />
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
