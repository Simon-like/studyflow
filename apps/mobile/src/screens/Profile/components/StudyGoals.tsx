import React from 'react';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { ProgressBar } from '../../../components/business/ProgressBar';
import { STUDY_GOALS } from '../constants';

export function StudyGoals() {
  return (
    <Card>
      <SectionHeader title="学习目标进度" />
      {STUDY_GOALS.map(goal => (
        <ProgressBar
          key={goal.label}
          label={goal.label}
          progress={goal.progress}
        />
      ))}
    </Card>
  );
}
