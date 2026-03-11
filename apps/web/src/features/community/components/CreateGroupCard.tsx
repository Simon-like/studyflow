import { Plus } from 'lucide-react';

export function CreateGroupCard() {
  return (
    <div className="bg-warm rounded-2xl p-5 border-2 border-dashed border-mist flex flex-col items-center justify-center text-center cursor-pointer hover:border-coral transition-all group">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-soft group-hover:shadow-medium transition-all">
        <Plus className="w-6 h-6 text-stone group-hover:text-coral transition-colors" />
      </div>
      <p className="text-stone text-sm font-medium group-hover:text-coral transition-colors">
        创建新小组
      </p>
    </div>
  );
}
