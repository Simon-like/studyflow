'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, User, Menu, X } from 'lucide-react';
import { Button } from '@studyflow/ui';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: '仪表盘' },
    { href: '/tasks', label: '任务' },
    { href: '/pomodoro', label: '番茄钟' },
    { href: '/stats', label: '统计' },
    { href: '/community', label: '社区' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-coral rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="ml-2 text-xl font-display font-bold text-charcoal">
                StudyFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-coral'
                    : 'text-stone hover:text-charcoal'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-stone hover:text-charcoal transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/profile" className="flex items-center">
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-stone hover:text-charcoal transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-mist">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-coral/10 text-coral'
                      : 'text-stone hover:bg-warm hover:text-charcoal'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center space-x-4 pt-4 border-t border-mist">
                <button className="p-2 text-stone hover:text-charcoal transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <Link href="/profile" className="flex items-center">
                  <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}