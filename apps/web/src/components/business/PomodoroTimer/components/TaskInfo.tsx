import { FileText } from 'lucide-react';

interface TaskInfoProps {
  title: string;
  subtitle?: string;
  progress?: string;
  onShowDetail?: () => void;
}

export function TaskInfo({ title, subtitle, progress, onShowDetail }: TaskInfoProps) {
  return (
    <div className="bg-warm rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-coral/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-charcoal font-medium text-sm">{title}</p>
          {subtitle && <p className="text-stone text-xs">{subtitle}</p>}
        </div>
        {progress && (
          <span className="text-xs text-stone bg-white px-2 py-1 rounded-full flex-shrink-0">
            {progress}
          </span>
        )}
        {onShowDetail && (
          <button
            onClick={onShowDetail}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/80 transition-colors flex-shrink-0"
            title="查看任务详情"
          >
            <FileText className="w-4 h-4 text-stone" />
          </button>
        )}
      </div>
    </div>
  );
}
