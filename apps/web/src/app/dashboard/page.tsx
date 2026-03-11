'use client';

import React from 'react';
import { Card, Button, Timer } from '@studyflow/ui';
import { 
  Clock, 
  ListTodo, 
  Target, 
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: '今日专注', value: '2.5小时', icon: Clock, color: 'coral' },
    { label: '完成任务', value: '8个', icon: ListTodo, color: 'sage' },
    { label: '连续天数', value: '5天', icon: Target, color: 'coral' },
    { label: '学习效率', value: '92%', icon: TrendingUp, color: 'sage' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-coral/20 to-sage/20 rounded-2xl p-6">
        <h1 className="text-3xl font-display font-bold text-charcoal mb-2">
          欢迎回来，应东林！
        </h1>
        <p className="text-stone">
          今天也要保持专注哦，继续你的学习之旅吧！
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} variant="hover">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}/20 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-stone">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-charcoal">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pomodoro Timer */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-charcoal">
                番茄钟
              </h2>
              <Button variant="ghost" size="sm">查看详情</Button>
            </div>
            
            <div className="flex flex-col items-center py-8">
              <Timer size="lg" />
              
              <div className="mt-6 text-center">
                <p className="text-stone text-sm mb-2">当前任务：React Native 学习</p>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">跳过休息</Button>
                  <Button variant="primary" size="sm">完成任务</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Tasks */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-charcoal">
                今日任务
              </h2>
              <Button variant="ghost" size="sm">全部</Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-warm">
                <div className="w-2 h-2 rounded-full bg-coral"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">完成UI组件重构</p>
                  <p className="text-xs text-stone">优先级：高</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-warm">
                <div className="w-2 h-2 rounded-full bg-sage"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">学习React Hooks</p>
                  <p className="text-xs text-stone">优先级：中</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-warm">
                <div className="w-2 h-2 rounded-full bg-mist"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">阅读文档</p>
                  <p className="text-xs text-stone">优先级：低</p>
                </div>
              </div>
            </div>

            <Button variant="secondary" className="w-full mt-4">
              添加新任务
            </Button>
          </Card>
        </div>
      </div>

      {/* Achievements & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-charcoal">
              最近成就
            </h2>
            <Award className="w-5 h-5 text-coral" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-coral" />
              </div>
              <div>
                <p className="font-medium text-charcoal">专注达人</p>
                <p className="text-sm text-stone">连续专注30分钟</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-sage" />
              </div>
              <div>
                <p className="font-medium text-charcoal">任务完成者</p>
                <p className="text-sm text-stone">完成10个任务</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-charcoal">
              本周进度
            </h2>
            <TrendingUp className="w-5 h-5 text-sage" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-stone">本周目标</span>
                <span className="font-medium text-charcoal">75%</span>
              </div>
              <div className="w-full bg-mist rounded-full h-2">
                <div className="bg-coral h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-stone">学习时长</span>
                <span className="font-medium text-charcoal">12.5小时</span>
              </div>
              <div className="w-full bg-mist rounded-full h-2">
                <div className="bg-sage h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}