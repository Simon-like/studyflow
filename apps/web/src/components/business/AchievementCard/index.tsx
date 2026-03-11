import type { AchievementCardProps, Achievement } from './types';

export function AchievementCard({
  id,
  icon,
  title,
  description,
  unlocked,
  color,
  onClick,
}: AchievementCardProps) {
  const colorClass = color === 'coral' ? 'bg-coral/20' : 'bg-sage/20';

  return (
    <div
      onClick={() => unlocked && onClick?.(id)}
      className={`flex flex-col items-center p-3 rounded-xl text-center transition-all ${
        unlocked
          ? 'bg-warm hover:shadow-soft cursor-pointer'
          : 'opacity-40 grayscale'
      }`}
    >
      <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center mb-2 text-2xl`}>
        {icon}
      </div>
      <p className="text-charcoal text-xs font-medium leading-tight">{title}</p>
      <p className="text-stone text-xs mt-0.5 leading-tight">{description}</p>
    </div>
  );
}

export { type AchievementCardProps, type Achievement } from './types';
