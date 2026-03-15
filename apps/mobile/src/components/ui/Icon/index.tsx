import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconProps } from './types';
import { colors } from '../../../theme';

export * from './types';

// Home 图标
function HomeIcon({ active, color }: { active?: boolean; color?: string }) {
  const iconColor = color || (active ? colors.primary : colors.textSecondary);
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.homeRoof, { borderColor: iconColor }]} />
      <View style={[styles.homeBody, { borderColor: iconColor, backgroundColor: active ? `${colors.primary}20` : 'transparent' }]} />
    </View>
  );
}

// 聊天图标
function ChatIcon({ active, color }: { active?: boolean; color?: string }) {
  const iconColor = color || (active ? colors.primary : colors.textSecondary);
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.chatBubble, { borderColor: iconColor }]} />
      <View style={[styles.chatTail, { borderTopColor: iconColor }]} />
    </View>
  );
}

// 用户组图标
function UsersIcon({ active, color }: { active?: boolean; color?: string }) {
  const iconColor = color || (active ? colors.primary : colors.textSecondary);
  return (
    <View style={[styles.iconContainer, styles.usersContainer]}>
      <View style={[styles.userDot, { borderColor: iconColor }]} />
      <View style={[styles.userDot, { borderColor: iconColor }]} />
    </View>
  );
}

// 用户图标
function UserIcon({ active, color }: { active?: boolean; color?: string }) {
  const iconColor = color || (active ? colors.primary : colors.textSecondary);
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.userHead, { borderColor: iconColor }]} />
      <View style={[styles.userBody, { borderColor: iconColor }]} />
    </View>
  );
}

// 播放图标
function PlayIcon({ color = colors.surface }: { color?: string }) {
  return (
    <View style={[styles.playIcon, { borderLeftColor: color }]} />
  );
}

// 暂停图标
function PauseIcon({ color = colors.surface }: { color?: string }) {
  return (
    <View style={styles.pauseContainer}>
      <View style={[styles.pauseBar, { backgroundColor: color }]} />
      <View style={[styles.pauseBar, { backgroundColor: color }]} />
    </View>
  );
}

// 检查图标
function CheckIcon({ color = colors.success }: { color?: string }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.checkMark, { color }]}>✓</Text>
    </View>
  );
}

// 右箭头图标
function ChevronRightIcon({ color = colors.textMuted }: { color?: string }) {
  return (
    <Text style={[styles.chevron, { color }]}>›</Text>
  );
}

// 更多图标
function MoreIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.moreText, { color }]}>···</Text>
  );
}

// 发送图标
function SendIcon({ color = colors.surface }: { color?: string }) {
  return (
    <Text style={[styles.sendText, { color }]}>→</Text>
  );
}

// 任务/清单图标
function TasksIcon({ active, color }: { active?: boolean; color?: string }) {
  const iconColor = color || (active ? colors.primary : colors.textSecondary);
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.taskBox, { borderColor: iconColor }]}>
        <View style={[styles.taskCheck, { borderColor: iconColor }]} />
        <View style={[styles.taskLine, { backgroundColor: iconColor }]} />
        <View style={[styles.taskLineShort, { backgroundColor: iconColor }]} />
      </View>
    </View>
  );
}

// 设置图标
function SettingsIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.settingsText, { color }]}>⚙</Text>
  );
}

// 左箭头图标
function ChevronLeftIcon({ color = colors.textMuted }: { color?: string }) {
  return (
    <Text style={[styles.chevronLeft, { color }]}>‹</Text>
  );
}

// 相机图标
function CameraIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.cameraText, { color }]}>📷</Text>
  );
}

// 退出登录图标
function LogOutIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.logOutText, { color }]}>→</Text>
  );
}

// 删除图标
function Trash2Icon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.trashText, { color }]}>🗑</Text>
  );
}

// 时钟图标
function ClockIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.clockText, { color }]}>🕐</Text>
  );
}

// 铃铛图标
function BellIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.bellText, { color }]}>🔔</Text>
  );
}

// 调色板图标
function PaletteIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.paletteText, { color }]}>🎨</Text>
  );
}

// 盾牌图标
function ShieldIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.shieldText, { color }]}>🛡</Text>
  );
}

// 图表图标
function BarChart2Icon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.barChartText, { color }]}>📊</Text>
  );
}

// 奖章图标
function AwardIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.awardText, { color }]}>🏆</Text>
  );
}

// 帮助图标
function HelpCircleIcon({ color = colors.text }: { color?: string }) {
  return (
    <Text style={[styles.helpText, { color }]}>?</Text>
  );
}

// 主组件
export function Icon({ name, size = 24, color, active = false }: IconProps) {
  const iconProps = { active, color };
  
  switch (name) {
    case 'home':
      return <HomeIcon {...iconProps} />;
    case 'chat':
      return <ChatIcon {...iconProps} />;
    case 'users':
      return <UsersIcon {...iconProps} />;
    case 'user':
      return <UserIcon {...iconProps} />;
    case 'play':
      return <PlayIcon color={color} />;
    case 'pause':
      return <PauseIcon color={color} />;
    case 'check':
      return <CheckIcon color={color} />;
    case 'chevron-right':
      return <ChevronRightIcon color={color} />;
    case 'chevron-left':
      return <ChevronLeftIcon color={color} />;
    case 'more':
      return <MoreIcon color={color} />;
    case 'send':
      return <SendIcon color={color} />;
    case 'tasks':
      return <TasksIcon {...iconProps} />;
    case 'settings':
      return <SettingsIcon color={color} />;
    case 'camera':
      return <CameraIcon color={color} />;
    case 'log-out':
      return <LogOutIcon color={color} />;
    case 'trash-2':
      return <Trash2Icon color={color} />;
    case 'clock':
      return <ClockIcon color={color} />;
    case 'bell':
      return <BellIcon color={color} />;
    case 'palette':
      return <PaletteIcon color={color} />;
    case 'shield':
      return <ShieldIcon color={color} />;
    case 'bar-chart-2':
      return <BarChart2Icon color={color} />;
    case 'award':
      return <AwardIcon color={color} />;
    case 'help-circle':
      return <HelpCircleIcon color={color} />;
    default:
      return null;
  }
}

// 预设图标组件（用于底部导航）
export function HomeIconComponent({ active }: { active: boolean }) {
  return <Icon name="home" active={active} />;
}

export function ChatIconComponent({ active }: { active: boolean }) {
  return <Icon name="chat" active={active} />;
}

export function UsersIconComponent({ active }: { active: boolean }) {
  return <Icon name="users" active={active} />;
}

export function UserIconComponent({ active }: { active: boolean }) {
  return <Icon name="user" active={active} />;
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRoof: {
    width: 10,
    height: 10,
    borderWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginBottom: 2,
  },
  homeBody: {
    width: 14,
    height: 10,
    borderWidth: 2,
    borderTopWidth: 0,
  },
  chatBubble: {
    width: 20,
    height: 14,
    borderRadius: 8,
    borderWidth: 2,
  },
  chatTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
    marginLeft: -6,
    alignSelf: 'flex-start',
  },
  usersContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  userDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  userHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginBottom: 2,
  },
  userBody: {
    width: 18,
    height: 8,
    borderRadius: 9,
    borderWidth: 2,
    borderBottomWidth: 0,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 16,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },
  pauseContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  pauseBar: {
    width: 5,
    height: 22,
    borderRadius: 3,
  },
  checkMark: {
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },
  moreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskBox: {
    width: 20,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    padding: 2,
    justifyContent: 'center',
    gap: 3,
  },
  taskCheck: {
    width: 6,
    height: 6,
    borderWidth: 1.5,
    borderRadius: 2,
    position: 'absolute',
    left: 3,
    top: 4,
  },
  taskLine: {
    width: 8,
    height: 1.5,
    marginLeft: 9,
    marginTop: 1,
    borderRadius: 1,
  },
  taskLineShort: {
    width: 5,
    height: 1.5,
    marginLeft: 9,
    borderRadius: 1,
  },
  settingsText: {
    fontSize: 20,
  },
  chevronLeft: {
    fontSize: 20,
    fontWeight: '300',
  },
  cameraText: {
    fontSize: 18,
  },
  logOutText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trashText: {
    fontSize: 18,
  },
  clockText: {
    fontSize: 18,
  },
  bellText: {
    fontSize: 18,
  },
  paletteText: {
    fontSize: 18,
  },
  shieldText: {
    fontSize: 18,
  },
  barChartText: {
    fontSize: 18,
  },
  awardText: {
    fontSize: 18,
  },
  helpText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
