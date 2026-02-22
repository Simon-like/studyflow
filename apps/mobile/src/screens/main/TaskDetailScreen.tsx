/**
 * 任务详情页面
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { taskId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>任务详情</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 任务标题 */}
        <View style={styles.taskHeader}>
          <View style={[styles.priorityBadge, { backgroundColor: '#FF6B6B20' }]}>
            <Text style={[styles.priorityText, { color: '#FF6B6B' }]}>高优先级</Text>
          </View>
          <Text style={styles.taskTitle}>完成数学作业</Text>
          <Text style={styles.taskDesc}>需要完成第 3 章的练习题，共 15 道</Text>
        </View>

        {/* 任务信息 */}
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#999" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>截止日期</Text>
              <Text style={styles.infoValue}>2024年12月25日</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#999" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>预计时长</Text>
              <Text style={styles.infoValue}>2 小时</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="layers-outline" size={20} color="#999" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>任务状态</Text>
              <Text style={styles.infoValue}>进行中</Text>
            </View>
          </View>
        </View>

        {/* 番茄钟记录 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>番茄钟记录</Text>
          <View style={styles.pomodoroList}>
            <View style={styles.pomodoroItem}>
              <View style={styles.pomodoroDot} />
              <View style={styles.pomodoroContent}>
                <Text style={styles.pomodoroTitle}>专注时段</Text>
                <Text style={styles.pomodoroTime}>25 分钟 · 今天 10:00</Text>
              </View>
            </View>
            <View style={styles.pomodoroItem}>
              <View style={styles.pomodoroDot} />
              <View style={styles.pomodoroContent}>
                <Text style={styles.pomodoroTitle}>专注时段</Text>
                <Text style={styles.pomodoroTime}>25 分钟 · 今天 10:30</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 开始专注按钮 */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('PomodoroTimer', { taskId })}
        >
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.startButtonText}>开始专注</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  moreButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  taskHeader: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  taskDesc: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  pomodoroList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  pomodoroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pomodoroDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B',
    marginRight: 12,
  },
  pomodoroContent: {
    flex: 1,
  },
  pomodoroTitle: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  pomodoroTime: {
    fontSize: 13,
    color: '#999',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
