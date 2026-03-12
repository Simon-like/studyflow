import { Outlet } from 'react-router-dom';
import { Lightbulb, Clock, CheckCircle, Smile } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-warm to-cream flex">
      {/* Left Panel - Branding */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-coral to-coral-200 rounded-2xl flex items-center justify-center shadow-xl mb-8">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-charcoal mb-4">StudyFlow</h1>
          <p className="text-xl text-stone mb-8">你的智能学习伙伴，陪伴每一次专注</p>
          <div className="space-y-4 text-stone flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-coral" />
              </div>
              <span>AI智能规划学习计划</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sage/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-sage-600" />
              </div>
              <span>番茄钟专注管理</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral/20 rounded-xl flex items-center justify-center">
                <Smile className="w-5 h-5 text-coral" />
              </div>
              <span>虚拟学伴实时互动</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-[420px] bg-white p-12 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
