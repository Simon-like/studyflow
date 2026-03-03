import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-coral items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1920&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="relative z-10 text-white text-center px-12">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">StudyFlow</h1>
          <p className="text-white/80 text-lg max-w-md">
            智能学习陪伴应用，让学习如流水般顺畅自然
          </p>
          <div className="mt-8 flex justify-center gap-8 text-white/70 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">AI</div>
              <div>智能陪伴</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">⏱️</div>
              <div>番茄专注</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">📊</div>
              <div>数据驱动</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 gradient-coral rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-charcoal">StudyFlow</h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}
