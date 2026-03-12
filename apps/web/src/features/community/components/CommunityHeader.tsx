import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';

export function CommunityHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">学习社区</h1>
        <p className="text-stone text-sm mt-0.5">与同学共同进步，相互鼓励加油</p>
      </div>
      <Button leftIcon={<Plus className="w-4 h-4" />}>发布动态</Button>
    </div>
  );
}
