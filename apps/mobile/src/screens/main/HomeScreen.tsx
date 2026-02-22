/**
 * 首页 - 学习仪表盘
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';

export const HomeScreen: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 头部欢迎 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>早上好，</Text>
            <Text style={styles.username}>{user?.nickname || user?.username || '学习者'}</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Ionicons name="person" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* 今日概览卡片 */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>今日学习</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2.5h</Text>
              <Text style={styles.statLabel}>专注时长</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>完成任务</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>番茄钟</Text>
            </View>
          </View>
        </View>

        {/* 快速开始 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快速开始</Text>
          <TouchableOpacity style={styles.pomodoroCard}>
            <View style={styles.pomodoroIcon}>
              <Ionicons name="timer" size={32} color="#FF6B6B" />
            </View>
            <View style={styles.pomodoroInfo}>
              <Text style={styles.pomodoroTitle}>开始专注</Text>
              <Text style={styles.pomodoroSubtitle}>25分钟番茄钟</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* 今日任务 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日任务</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>查看全部</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.taskList}>
            <View style={styles.taskItem}>
              <View style={[styles.taskCheckbox, styles.taskChecked]}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
              <Text style={[styles.taskText, styles.taskTextCompleted]}>完成数学作业</Text>
            </View>
            <View style={styles.taskItem}>
              <View style={styles.taskCheckbox} />
              <Text style={styles.taskText}>阅读英语文章</Text>
            </View>
            <View style={styles.taskItem}>
              <View style={styles.taskCheckbox} />
              <Text style={styles.taskText}>复习历史笔记</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewCard: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#FF6B6B',
  },
  pomodoroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pomodoroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pomodoroInfo: {
    flex: 1,
  },
  pomodoroTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pomodoroSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  taskList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  taskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#DDD',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskChecked: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});
