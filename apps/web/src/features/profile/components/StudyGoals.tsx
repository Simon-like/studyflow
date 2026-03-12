import { Card, CardHeader, ProgressBar } from '@/components/ui';
import { STUDY_GOALS } from '../constants';

export function StudyGoals() {
  return (
    <Card className="mt-8">
      <CardHeader title="学习目标" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STUDY_GOALS.map((goal) => (
          <div key={goal.id} className="bg-warm rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <p className="text-charcoal font-medium text-sm">{goal.label}</p>
              <span className="text-coral text-sm font-bold">{goal.progress}%</span>
            </div>
            <ProgressBar progress={goal.progress} size="sm" className="mb-2" />
            <p className="text-stone text-xs">
              {goal.done} / {goal.total}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
