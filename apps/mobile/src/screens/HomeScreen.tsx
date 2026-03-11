import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  coral: '#E8A87C',
  coralLight: '#F5C9A8',
  coralDark: '#D4956A',
  sage: '#9DB5A0',
  cream: '#FDF8F3',
  warm: '#FAF5F0',
  charcoal: '#3D3D3D',
  stone: '#8A8A8A',
  mist: '#C9C5C1',
  white: '#FFFFFF',
};

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TOTAL_SECS = 25 * 60;

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const TASKS = [
  { id: 1, title: '英语单词背诵', sub: '100个单词 · 已完成', done: true, active: false },
  { id: 2, title: '考研数学复习', sub: '进行中 · 预计4个番茄', done: false, active: true },
  { id: 3, title: '专业课笔记整理', sub: '预计2个番茄', done: false, active: false },
];

export function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECS);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [todayCount, setTodayCount] = useState(2);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && !paused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setPaused(false);
            setTodayCount((c) => c + 1);
            return TOTAL_SECS;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, paused]);

  const progress = ((TOTAL_SECS - timeLeft) / TOTAL_SECS) * CIRCUMFERENCE;

  const handleMainBtn = () => {
    if (!running) {
      setRunning(true);
      setPaused(false);
    } else if (!paused) {
      setPaused(true);
    } else {
      setPaused(false);
    }
  };

  const handleStop = () => {
    setRunning(false);
    setPaused(false);
    setTimeLeft(TOTAL_SECS);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerSub}>今天也要加油哦</Text>
              <Text style={styles.headerTitle}>Hi, 应东林</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>Y</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Pomodoro Timer Card */}
      <View style={styles.timerCard}>
        <View style={styles.timerCardHeader}>
          <Text style={styles.cardLabel}>今日专注</Text>
          <Text style={styles.cardLink}>查看统计</Text>
        </View>

        {/* SVG Ring */}
        <View style={styles.timerRingWrapper}>
          <Svg width={200} height={200} style={styles.timerRingSvg}>
            <Circle cx={100} cy={100} r={RADIUS} stroke={COLORS.coralLight} strokeWidth={8} fill="none" />
            <Circle
              cx={100} cy={100} r={RADIUS}
              stroke={COLORS.coral} strokeWidth={8} fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE - progress}
              strokeLinecap="round"
              rotation={-90}
              origin="100, 100"
            />
          </Svg>
          <View style={styles.timerTextWrapper}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerSubText}>剩余时间</Text>
          </View>
        </View>

        {/* Task Info */}
        <View style={styles.taskInfo}>
          <View style={styles.taskIconBox}>
            <Text style={styles.taskIconEmoji}>📖</Text>
          </View>
          <View style={styles.taskTextBox}>
            <Text style={styles.taskTitle}>考研数学复习</Text>
            <Text style={styles.taskSub}>第三章 · 线性代数</Text>
          </View>
          <View style={styles.tomatoBadge}>
            <Text style={styles.tomatoBadgeText}>2/4 番茄</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.ctrlSecondary} onPress={handleStop} activeOpacity={0.7}>
            <Text style={styles.ctrlSecondaryIcon}>↺</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlPrimary} onPress={handleMainBtn} activeOpacity={0.8}>
            {!running || paused ? (
              <View style={styles.playIcon} />
            ) : (
              <View style={styles.pauseIconWrapper}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlSecondary} activeOpacity={0.7}>
            <Text style={styles.ctrlSecondaryIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: '今日番茄', value: String(todayCount) },
          { label: '完成任务', value: '3/6' },
          { label: '连续天数', value: '23天' },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Today Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>今日任务</Text>
          <Text style={styles.sectionLink}>3/6 已完成</Text>
        </View>

        {TASKS.map((task) => (
          <View
            key={task.id}
            style={[styles.taskRow, task.active && styles.taskRowActive]}
          >
            <View style={[styles.checkCircle, task.done && styles.checkCircleDone, task.active && styles.checkCircleActive]}>
              {task.done && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <View style={styles.taskRowText}>
              <Text style={[styles.taskRowTitle, task.done && styles.taskRowTitleDone]}>
                {task.title}
              </Text>
              <Text style={styles.taskRowSub}>{task.sub}</Text>
            </View>
            {task.active && <Text style={styles.activeTag}>进行中</Text>}
          </View>
        ))}

        <TouchableOpacity style={styles.addTaskBtn} activeOpacity={0.7}>
          <Text style={styles.addTaskText}>+ 添加新任务</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    backgroundColor: COLORS.cream,
  },
  headerGradient: {
    backgroundColor: `${COLORS.coral}25`,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.stone,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.charcoal,
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  timerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.stone,
  },
  cardLink: {
    fontSize: 13,
    color: COLORS.coral,
    fontWeight: '600',
  },
  timerRingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  timerRingSvg: {},
  timerTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.charcoal,
    letterSpacing: -1,
  },
  timerSubText: {
    fontSize: 12,
    color: COLORS.stone,
    marginTop: 2,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warm,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  taskIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${COLORS.coral}25`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIconEmoji: {
    fontSize: 18,
  },
  taskTextBox: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  taskSub: {
    fontSize: 11,
    color: COLORS.stone,
    marginTop: 1,
  },
  tomatoBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tomatoBadgeText: {
    fontSize: 11,
    color: COLORS.stone,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  ctrlSecondary: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.warm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlSecondaryIcon: {
    fontSize: 20,
    color: COLORS.stone,
  },
  ctrlPrimary: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 16,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: COLORS.white,
    marginLeft: 4,
  },
  pauseIconWrapper: {
    flexDirection: 'row',
    gap: 6,
  },
  pauseBar: {
    width: 5,
    height: 22,
    backgroundColor: COLORS.white,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.charcoal,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.stone,
    marginTop: 2,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  sectionLink: {
    fontSize: 13,
    color: COLORS.stone,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  taskRowActive: {
    borderWidth: 1.5,
    borderColor: COLORS.coral,
    backgroundColor: `${COLORS.coral}05`,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: {
    borderColor: COLORS.sage,
    backgroundColor: `${COLORS.sage}25`,
  },
  checkCircleActive: {
    borderColor: COLORS.coral,
  },
  checkMark: {
    fontSize: 12,
    color: COLORS.sage,
    fontWeight: '700',
  },
  taskRowText: {
    flex: 1,
  },
  taskRowTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.charcoal,
  },
  taskRowTitleDone: {
    color: COLORS.stone,
    textDecorationLine: 'line-through',
  },
  taskRowSub: {
    fontSize: 11,
    color: COLORS.stone,
    marginTop: 2,
  },
  activeTag: {
    fontSize: 12,
    color: COLORS.coral,
    fontWeight: '600',
  },
  addTaskBtn: {
    borderWidth: 2,
    borderColor: COLORS.mist,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  addTaskText: {
    fontSize: 13,
    color: COLORS.stone,
    fontWeight: '500',
  },
});
