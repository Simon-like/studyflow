import type { QuickAction } from '../types';
import { QUICK_ACTIONS } from '../constants';

interface QuickActionsProps {
  onActionClick: (action: QuickAction) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="px-8 py-3">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            onClick={() => onActionClick(action)}
            className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm text-charcoal shadow-soft hover:shadow-medium hover:text-coral transition-all active:scale-95"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
