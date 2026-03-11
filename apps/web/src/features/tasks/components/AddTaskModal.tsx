import { Button } from '@/components/ui';
import type { TaskFormData, Priority } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  formData: TaskFormData;
  onClose: () => void;
  onSubmit: () => void;
  onFieldChange: <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => void;
}

export function AddTaskModal({
  isOpen,
  formData,
  onClose,
  onSubmit,
  onFieldChange,
}: AddTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-strong animate-slide-up">
        <h3 className="font-display text-xl font-bold text-charcoal mb-6">添加新任务</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-stone font-medium">任务标题</label>
            <input
              type="text"
              placeholder="输入任务名称"
              value={formData.title}
              onChange={(e) => onFieldChange('title', e.target.value)}
              className="w-full mt-1.5 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm text-stone font-medium">任务描述</label>
            <input
              type="text"
              placeholder="简要描述任务内容"
              value={formData.description}
              onChange={(e) => onFieldChange('description', e.target.value)}
              className="w-full mt-1.5 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-stone font-medium">优先级</label>
              <select
                value={formData.priority}
                onChange={(e) => onFieldChange('priority', e.target.value as Priority)}
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
                value={formData.pomodoros}
                onChange={(e) => onFieldChange('pomodoros', parseInt(e.target.value) || 1)}
                className="w-full mt-1.5 px-4 py-3 bg-warm rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all text-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" fullWidth onClick={onClose}>
            取消
          </Button>
          <Button fullWidth onClick={onSubmit}>
            添加任务
          </Button>
        </div>
      </div>
    </div>
  );
}
