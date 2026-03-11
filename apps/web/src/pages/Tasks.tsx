import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Clock, Flag } from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';
type Status = 'todo' | 'in_progress' | 'completed';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  pomodoros: number;
  dueDate?: string;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high: { label: '高', color: 'text-coral', bg: 'bg-coral/10' },
  medium: { label: '中', color: 'text-amber-600', bg: 'bg-amber-50' },
  low: { label: '低', color: 'text-sage', bg: 'bg-sage/10' },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  todo: { label: '待开始', color: 'text-stone', bg: 'bg-warm' },
  in_progress: { label: '进行中', color: 'text-coral', bg: 'bg-coral/10' },
  completed: { label: '已完成', color: 'text-sage', bg: 'bg-sage/10' },
};

const INITIAL_TASKS: Task[] = [
  { id: '1', title: '考研数学复习', description: '第三章 线性代数 · 行列式与矩阵', priority: 'high', status: 'in_progress', pomodoros: 4, dueDate: '2026-03-15' },
  { id: '2', title: '英语单词背诵', description: '每日200个核心词汇', priority: 'medium', status: 'completed', pomodoros: 2, dueDate: '2026-03-11' },
  { id: '3', title: '政治错题整理', description: '近代史部分重点标注', priority: 'medium', status: 'todo', pomodoros: 2, dueDate: '2026-03-16' },
  { id: '4', title: '专业课笔记', description: '数据结构第五章整理', priority: 'high', status: 'todo', pomodoros: 3, dueDate: '2026-03-17' },
  { id: '5', title: '阅读理解练习', description: '精读两篇英文文章', priority: 'low', status: 'todo', pomodoros: 1, dueDate: '2026-03-18' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as Priority, pomodoros: 1 });

  const filtered = tasks.filter((t) => {
    const matchFilter = filter === 'all' || t.status === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'todo',
      pomodoros: newTask.pomodoros,
    };
    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', pomodoros: 1 });
    setShowAddModal(false);
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map((t) =>
      t.id === id
        ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' }
        : t
    ));
  };

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">任务管理</h1>
          <p className="text-stone text-sm mt-0.5">管理你的学习任务，保持高效专注</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-coral text-white px-4 py-2.5 rounded-xl font-medium hover:bg-coral-600 transition-all active:scale-95 shadow-coral"
        >
          <Plus className="w-4 h-4" />
          添加任务
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
          <input
            type="text"
            placeholder="搜索任务..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-mist rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {([['all', '全部'], ['todo', '待开始'], ['in_progress', '进行中'], ['completed', '已完成']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-coral text-white shadow-coral'
                  : 'bg-white text-stone border border-mist hover:bg-warm'
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs opacity-70">({counts[key]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-soft">
            <div className="w-16 h-16 bg-warm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-charcoal font-medium mb-1">暂无任务</p>
            <p className="text-stone text-sm">点击右上角添加你的第一个学习任务</p>
          </div>
        ) : (
          filtered.map((task) => {
            const p = PRIORITY_CONFIG[task.priority];
            const s = STATUS_CONFIG[task.status];
            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-4 shadow-soft hover:-translate-y-0.5 hover:shadow-medium transition-all flex items-center gap-4 ${
                  task.status === 'completed' ? 'opacity-70' : ''
                }`}
              >
                <button
                  onClick={() => toggleStatus(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    task.status === 'completed'
                      ? 'border-sage bg-sage/20'
                      : task.status === 'in_progress'
                      ? 'border-coral'
                      : 'border-mist hover:border-coral'
                  }`}
                >
                  {task.status === 'completed' && (
                    <svg className="w-3.5 h-3.5 text-sage" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-stone' : 'text-charcoal'}`}>
                      {task.title}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.bg} ${p.color}`}>
                      <Flag className="w-2.5 h-2.5 inline mr-1" />{p.label}优先
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
                  </div>
                  <p className="text-stone text-xs mt-1 truncate">{task.description}</p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 text-xs text-stone">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.pomodoros} 番茄</span>
                  </div>
                  {task.dueDate && <span>{task.dueDate}</span>}
                  <button className="p-1 hover:bg-warm rounded-lg transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-strong animate-slide-up">
            <h3 className="font-display text-xl font-bold text-charcoal mb-6">添加新任务</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-stone font-medium">任务标题</label>
                <input
                  type="text"
                  placeholder="输入任务名称"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm text-stone font-medium">任务描述</label>
                <input
                  type="text"
                  placeholder="简要描述任务内容"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-stone font-medium">优先级</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full mt-1.5 px-4 py-3 bg-warm rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all text-sm"
                  >
                    <option value="high">高优先级</option>
                    <option value="medium">中优先级</option>
                    <option value="low">低优先级</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-stone font-medium">预估番茄数</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newTask.pomodoros}
                    onChange={(e) => setNewTask({ ...newTask, pomodoros: parseInt(e.target.value) || 1 })}
                    className="w-full mt-1.5 px-4 py-3 bg-warm rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-warm text-charcoal rounded-xl font-medium hover:bg-mist/30 transition-all"
              >
                取消
              </button>
              <button
                onClick={addTask}
                className="flex-1 py-3 bg-coral text-white rounded-xl font-medium hover:bg-coral-600 transition-all active:scale-95"
              >
                添加任务
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
