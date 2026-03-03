import { BookOpen } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 gradient-coral rounded-2xl flex items-center justify-center animate-pulse">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -inset-2 border-2 border-coral/30 rounded-3xl animate-ping" />
      </div>
      <p className="mt-4 text-stone text-sm">加载中...</p>
    </div>
  );
}
