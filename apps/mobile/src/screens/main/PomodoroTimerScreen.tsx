/**
 * 番茄钟计时器页面
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PomodoroTimer'>;

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;
const STROKE_WIDTH = 10;

export const PomodoroTimerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { taskId } = route.params || {};
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分钟
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const totalTime = 25 * 60;
  const progress = (totalTime - timeLeft) / totalTime;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // TODO: 播放完成提示音
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(totalTime);
  };

  const handleComplete = () => {
    // TODO: 提交完成的番茄钟
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>专注中</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 任务信息 */}
      <View style={styles.taskInfo}>
        <Text style={styles.taskLabel}>当前任务</Text>
        <Text style={styles.taskName}>完成数学作业</Text>
      </View>

      {/* 计时器圆环 */}
      <View style={styles.timerContainer}>
        <View style={styles.circleContainer}>
          {/* 背景圆环 */}
          <View style={styles.circleBackground} />
          {/* 进度圆环 */}
          <View style={[styles.circleProgress, { 
            borderColor: '#FF6B6B',
            borderWidth: STROKE_WIDTH,
          }]} />
          {/* 时间显示 */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.statusText}>
              {isRunning ? '专注中...' : isPaused ? '已暂停' : '准备开始'}
            </Text>
          </View>
        </View>
      </View>

      {/* 控制按钮 */}
      <View style={styles.controls}>
        {!isRunning && !isPaused ? (
          // 初始状态 - 开始按钮
          <TouchableOpacity style={styles.mainButton} onPress={handleStart}>
            <Ionicons name="play" size={32} color="#fff" />
          </TouchableOpacity>
        ) : isRunning ? (
          // 运行状态 - 暂停和停止按钮
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleStop}>
              <Ionicons name="stop" size={24} color="#FF6B6B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainButton} onPress={handlePause}>
              <Ionicons name="pause" size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleComplete}>
              <Ionicons name="checkmark" size={24} color="#2ED573" />
            </TouchableOpacity>
          </View>
        ) : (
          // 暂停状态 - 继续和停止按钮
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleStop}>
              <Ionicons name="stop" size={24} color="#FF6B6B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainButton} onPress={handleResume}>
              <Ionicons name="play" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 提示文字 */}
      <Text style={styles.tipText}>
        {isRunning 
          ? '保持专注，不要分心哦！' 
          : isPaused 
            ? '休息一下，准备好再继续' 
            : '点击开始按钮开始专注'}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 36,
  },
  taskInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  taskLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackground: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: STROKE_WIDTH,
    borderColor: '#FFE0E0',
  },
  circleProgress: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderColor: '#FF6B6B',
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
    fontVariant: ['tabular-nums'],
  },
  statusText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 40,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
});
