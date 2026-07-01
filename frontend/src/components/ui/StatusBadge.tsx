interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  sending: 'bg-accent/10 text-accent',
  sent: 'bg-success/10 text-success',
  failed: 'bg-danger/10 text-danger',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
        statusStyles[status] || 'bg-card-border text-muted'
      }`}
    >
      {status}
    </span>
  );
}
