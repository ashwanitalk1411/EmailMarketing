interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}

export default function StatCard({ title, value, icon, color = 'text-accent' }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-accent/10 ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
