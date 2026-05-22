export function MatchCard({ score, explanation, title, company }: { score: number, explanation: string, title: string, company: string }) {
  return (
    <div className="p-6 border rounded-xl bg-gradient-to-br from-background to-muted shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
        <div className="text-2xl font-black text-primary">{score}%</div>
      </div>
      <p className="text-sm border-t pt-4 italic">&ldquo;{explanation}&rdquo;</p>
    </div>
  );
}
