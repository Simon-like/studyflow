import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始初始化数据库...');

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: hashedPassword,
      nickname: '测试用户',
      studyGoal: '每天专注学习 4 小时',
    },
  });

  console.log(`✅ 创建测试用户: ${user.username}`);

  // 初始化用户连续学习记录
  await prisma.userStreak.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      currentStreak: 0,
      longestStreak: 0,
    },
  });

  // 创建示例任务
  const tasks = [
    { title: '高等数学 - 极限与连续', category: '高等数学', priority: 'high' as const },
    { title: '英语单词背诵 50 个', category: '英语', priority: 'medium' as const },
    { title: '物理实验报告', category: '物理', priority: 'high' as const },
    { title: '阅读专业论文', category: '其他', priority: 'low' as const },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        userId: user.id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        status: 'todo',
      },
    });
  }

  console.log(`✅ 创建 ${tasks.length} 个示例任务`);

  console.log('✨ 数据库初始化完成！');
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
