import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
  color: 'coral' | 'sage';
}

export function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  const bgColor = color === 'coral' ? 'bg-coral/10' : 'bg-sage/10';
  const textColor = color === 'coral' ? 'text-coral' : 'text-sage';

  return (
    <div className="card p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
        <span className={`text-sm font-medium ${textColor}`}>{trend}</span>
      </div>
      <p className="font-display text-3xl font-bold text-charcoal">{value}</p>
      <p className="text-stone text-sm">{label}</p>
    </div>
  );
}
