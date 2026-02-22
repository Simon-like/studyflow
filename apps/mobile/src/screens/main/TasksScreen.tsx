/**
 * 任务管理页面
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type TaskFilter = 'all' | 'todo' | 'in_progress' | 'completed';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: TaskFilter;
  dueDate: string;
}

const mockTasks: Task[] = [
  { id: '1', title: '完成数学作业', priority: 'high', status: 'todo', dueDate: '今天' },
  { id: '2', title: '阅读英语文章', priority: 'medium', status: 'in_progress', dueDate: '今天' },
  { id: '3', title: '复习历史笔记', priority: 'low', status: 'todo', dueDate: '明天' },
  { id: '4', title: '练习编程题', priority: 'medium', status: 'completed', dueDate: '昨天' },
];

const filterLabels: Record<TaskFilter, string> = {
  all: '全部',
  todo: '待办',
  in_progress: '进行中',
  completed: '已完成',
};

const priorityColors = {
  high: '#FF6B6B',
  medium: '#FFA502',
  low: '#2ED573',
};

export const TasksScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');

  const filteredTasks = activeFilter === 'all' 
    ? mockTasks 
    : mockTasks.filter(task => task.status === activeFilter);

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskCard}>
      <View style={[styles.priorityIndicator, { backgroundColor: priorityColors[item.priority] }]} />
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskMeta}>截止: {item.dueDate}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.title}>任务管理</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 过滤器 */}
      <View style={styles.filterContainer}>
        {(Object.keys(filterLabels) as TaskFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filterLabels[filter]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 任务列表 */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  taskMeta: {
    fontSize: 13,
    color: '#999',
  },
  moreButton: {
    padding: 8,
  },
});
