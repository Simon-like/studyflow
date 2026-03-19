import { Outlet } from 'react-router-dom';
import { Lightbulb, Clock, CheckCircle, Smile } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-warm to-cream flex flex-col lg:flex-row">
      {/* Left Panel - Branding (hidden on small screens) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 xl:p-12">
        <div className="max-w-md">
          <div className="w-16 h-16 xl:w-20 xl:h-20 bg-gradient-to-br from-coral to-coral-200 rounded-2xl flex items-center justify-center shadow-xl mb-6 xl:mb-8">
            <Lightbulb className="w-8 h-8 xl:w-10 xl:h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl xl:text-4xl font-bold text-charcoal mb-4">StudyFlow</h1>
          <p className="text-lg xl:text-xl text-stone mb-6 xl:mb-8">你的智能学习伙伴，陪伴每一次专注</p>
          <div className="space-y-3 xl:space-y-4 text-stone flex flex-col gap-3 xl:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 xl:w-10 xl:h-10 bg-coral/20 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 xl:w-5 xl:h-5 text-coral" />
              </div>
              <span className="text-sm xl:text-base">AI智能规划学习计划</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 xl:w-10 xl:h-10 bg-sage/20 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 xl:w-5 xl:h-5 text-sage-600" />
              </div>
              <span className="text-sm xl:text-base">番茄钟专注管理</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 xl:w-10 xl:h-10 bg-coral/20 rounded-xl flex items-center justify-center shrink-0">
                <Smile className="w-4 h-4 xl:w-5 xl:h-5 text-coral" />
              </div>
              <span className="text-sm xl:text-base">虚拟学伴实时互动</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden bg-white/50 backdrop-blur-sm px-6 py-4 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-coral to-coral-200 rounded-xl flex items-center justify-center shadow-md">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-charcoal">StudyFlow</h1>
          <p className="text-xs text-stone">你的智能学习伙伴</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 lg:w-[420px] lg:flex-none bg-white px-6 py-8 sm:px-8 sm:py-12 lg:p-12 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
