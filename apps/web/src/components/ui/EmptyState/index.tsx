import type { EmptyStateProps } from './types';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`bg-white rounded-3xl p-12 text-center shadow-soft ${className}`}>
      {icon && (
        <div className="w-16 h-16 bg-warm rounded-2xl flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <p className="text-charcoal font-medium mb-1">{title}</p>
      {description && <p className="text-stone text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export { type EmptyStateProps } from './types';
