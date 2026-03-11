import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const COLORS = {
  coral: '#E8A87C',
  coralLight: '#F5C9A8',
  coralDark: '#D4956A',
  sage: '#9DB5A0',
  sageDark: '#7A9A7E',
  cream: '#FDF8F3',
  warm: '#FAF5F0',
  charcoal: '#3D3D3D',
  stone: '#8A8A8A',
  mist: '#C9C5C1',
  white: '#FFFFFF',
};

const ACHIEVEMENTS = [
  { icon: '⚡', title: '专注达人', desc: '连续专注30分钟', unlocked: true },
  { icon: '🎯', title: '任务完成', desc: '完成10个任务', unlocked: true },
  { icon: '🔥', title: '连续打卡', desc: '连续7天打卡', unlocked: true },
  { icon: '📚', title: '知识探索', desc: '学习100小时', unlocked: false },
  { icon: '🏆', title: '番茄大师', desc: '累计100个番茄', unlocked: false },
  { icon: '🌟', title: '社区之星', desc: '获得100赞', unlocked: false },
];

const WEEK_DATA = [3.5, 4.0, 2.5, 5.0, 3.0, 4.5, 2.0];
const MAX_H = Math.max(...WEEK_DATA);
const DAYS = ['一', '二', '三', '四', '五', '六', '日'];

const MENU_ITEMS = [
  { icon: '📊', label: '学习统计', sub: '查看详细数据' },
  { icon: '🏅', label: '成就中心', sub: '3/6 已解锁' },
  { icon: '⚙️', label: '番茄钟设置', sub: '25分钟专注' },
  { icon: '🔔', label: '通知设置', sub: '已开启' },
  { icon: '🎨', label: '外观主题', sub: '浅色模式' },
  { icon: '❓', label: '帮助与反馈', sub: '' },
];

export function ProfileScreen() {
  const [editMode, setEditMode] = useState(false);

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileBg} />
        <View style={styles.profileContent}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>Y</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(!editMode)} activeOpacity={0.8}>
              <Text style={styles.editBtnText}>编辑资料</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>应东林</Text>
          <Text style={styles.nameSub}>考研冲刺中 · 坚持 23 天</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>数学达人</Text>
            </View>
            <View style={[styles.badge, styles.badgeSage]}>
              <Text style={[styles.badgeText, styles.badgeTextSage]}>早起鸟</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        {[
          { label: '累计学习', value: '128h' },
          { label: '完成番茄', value: '48' },
          { label: '连续打卡', value: '23天' },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <View style={styles.statsDivider} />}
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Weekly Chart */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>本周学习时长</Text>
        <View style={styles.barChart}>
          {WEEK_DATA.map((h, i) => (
            <View key={i} style={styles.barItem}>
              <Text style={styles.barHours}>{h}h</Text>
              <View style={styles.barTrack}>
                <View
                  style={[styles.barFill, { height: `${(h / MAX_H) * 100}%` as any }]}
                />
              </View>
              <Text style={styles.barDay}>{DAYS[i]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>成就徽章</Text>
          <Text style={styles.sectionSub}>3/6 已解锁</Text>
        </View>
        <View style={styles.achievements}>
          {ACHIEVEMENTS.map((ach) => (
            <View
              key={ach.title}
              style={[styles.achievementItem, !ach.unlocked && styles.achievementLocked]}
            >
              <View style={[styles.achievementIcon, !ach.unlocked && styles.achievementIconLocked]}>
                <Text style={styles.achievementEmoji}>{ach.icon}</Text>
              </View>
              <Text style={styles.achievementTitle}>{ach.title}</Text>
              <Text style={styles.achievementDesc}>{ach.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Study Goals */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>学习目标进度</Text>
        {[
          { label: '考研数学', progress: 68 },
          { label: '英语备考', progress: 45 },
          { label: '专业课', progress: 82 },
        ].map((g) => (
          <View key={g.label} style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>{g.label}</Text>
              <Text style={styles.goalPercent}>{g.progress}%</Text>
            </View>
            <View style={styles.goalBar}>
              <View style={[styles.goalFill, { width: `${g.progress}%` as any }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={styles.sectionCard}>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, i > 0 && styles.menuItemBorder]}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.sub ? <Text style={styles.menuSub}>{item.sub}</Text> : null}
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  profileHeader: {
    position: 'relative',
    paddingBottom: 20,
  },
  profileBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: `${COLORS.coral}30`,
  },
  profileContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  editBtn: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.mist,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  editBtnText: {
    fontSize: 13,
    color: COLORS.charcoal,
    fontWeight: '500',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.charcoal,
  },
  nameSub: {
    fontSize: 13,
    color: COLORS.stone,
    marginTop: 3,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: `${COLORS.coral}25`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeSage: {
    backgroundColor: `${COLORS.sage}25`,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.coralDark,
    fontWeight: '500',
  },
  badgeTextSage: {
    color: COLORS.sageDark,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: -8,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsDivider: {
    width: 1,
    backgroundColor: `${COLORS.mist}50`,
    marginVertical: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.charcoal,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.stone,
    marginTop: 3,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginBottom: 16,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.stone,
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 6,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barHours: {
    fontSize: 9,
    color: COLORS.stone,
    marginBottom: 3,
  },
  barTrack: {
    width: '100%',
    height: 64,
    backgroundColor: `${COLORS.coral}20`,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: COLORS.coral,
    borderRadius: 6,
    width: '100%',
  },
  barDay: {
    fontSize: 10,
    color: COLORS.stone,
    marginTop: 4,
  },
  achievements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: COLORS.warm,
    borderRadius: 14,
    padding: 10,
  },
  achievementLocked: {
    opacity: 0.4,
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${COLORS.coral}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  achievementIconLocked: {
    backgroundColor: `${COLORS.mist}30`,
  },
  achievementEmoji: {
    fontSize: 22,
  },
  achievementTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.charcoal,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 10,
    color: COLORS.stone,
    textAlign: 'center',
    marginTop: 2,
  },
  goalItem: {
    marginBottom: 14,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.charcoal,
  },
  goalPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.coral,
  },
  goalBar: {
    height: 8,
    backgroundColor: `${COLORS.mist}40`,
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    backgroundColor: COLORS.coral,
    borderRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: `${COLORS.mist}25`,
  },
  menuIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.charcoal,
  },
  menuSub: {
    fontSize: 12,
    color: COLORS.stone,
    marginTop: 1,
  },
  menuChevron: {
    fontSize: 20,
    color: COLORS.mist,
    fontWeight: '300',
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.mist}60`,
  },
  logoutText: {
    fontSize: 15,
    color: '#E57373',
    fontWeight: '600',
  },
});
