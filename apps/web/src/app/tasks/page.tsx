'use client';

import React, { useState } from 'react';
import { Card, Button, Input } from '@studyflow/ui';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  Trash2,
  Edit
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  estimatedTime?: number;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '完成UI组件重构',
      description: '重构Button、Card、Input等核心组件',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-03-15',
      estimatedTime: 120,
    },
    {
      id: '2',
      title: '学习React Hooks',
      description: '深入理解useState、useEffect等Hooks',
      priority: 'medium',
      status: 'todo',
      dueDate: '2024-03-16',
      estimatedTime: 90,
    },
    {
      id: '3',
      title: '阅读文档',
      description: '阅读Next.js官方文档',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-03-14',
      estimatedTime: 60,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-coral';
      case 'medium': return 'text-sage';
      case 'low': return 'text-stone';
      default: return 'text-stone';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-sage" />;
      case 'in-progress': return <Circle className="w-5 h-5 text-coral" />;
      default: return <Circle className="w-5 h-5 text-stone" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal">
            任务管理
          </h1>
          <p className="text-stone mt-1">
            管理你的学习任务，保持高效学习
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          添加任务
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone" />
              <Input
                placeholder="搜索任务..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-mist rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
            >
              <option value="all">所有优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-mist rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
            >
              <option value="all">所有状态</option>
              <option value="todo">待办</option>
              <option value="in-progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="w-12 h-12 text-stone mx-auto mb-4" />
            <h3 className="text-lg font-medium text-charcoal mb-2">
              暂无任务
            </h3>
            <p className="text-stone mb-4">
              开始添加你的第一个学习任务吧！
            </p>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              添加任务
            </Button>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} variant="hover">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  {getStatusIcon(task.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-charcoal">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-stone mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-stone hover:text-coral transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-stone hover:text-error transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <Flag className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                      <span className={getPriorityColor(task.priority)}>
                        {task.priority === 'high' ? '高优先级' : 
                         task.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center space-x-1 text-stone">
                        <Calendar className="w-4 h-4" />
                        <span>{task.dueDate}</span>
                      </div>
                    )}

                    {task.estimatedTime && (
                      <div className="flex items-center space-x-1 text-stone">
                        <Clock className="w-4 h-4" />
                        <span>{task.estimatedTime}分钟</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}