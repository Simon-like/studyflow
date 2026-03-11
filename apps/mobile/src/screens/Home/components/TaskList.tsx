import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TaskCard } from '../../../components/business/TaskCard';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { colors, radius, spacing, fontWeight } from '../../../theme';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onAddTask: () => void;
}

export function TaskList({ tasks, onToggleTask, onAddTask }: TaskListProps) {
  const completedCount = tasks.filter(t => t.done).length;
  
  return (
    <View style={styles.container}>
      <SectionHeader
        title="今日任务"
        right={<Text style={styles.progress}>{completedCount}/{tasks.length} 已完成</Text>}
      />
      
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          subtitle={task.sub}
          status={task.active ? 'active' : task.done ? 'completed' : 'todo'}
          onToggle={() => onToggleTask(task.id)}
        />
      ))}
      
      <TouchableOpacity style={styles.addButton} onPress={onAddTask} activeOpacity={0.7}>
        <Text style={styles.addText}>+ 添加新任务</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  progress: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  addButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  addText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
});
