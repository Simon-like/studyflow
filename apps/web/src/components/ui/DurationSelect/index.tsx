import { useState, useRef, useEffect, useCallback } from 'react';
import { Portal } from '@/components/Portal';
import { ChevronDown, Clock } from 'lucide-react';

export interface DurationOption {
  value: number;
  label: string;
}

export interface DurationSelectProps {
  value: number;
  options: DurationOption[];
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DurationSelect({
  value,
  options,
  onChange,
  placeholder = '请选择',
  disabled = false,
  className = '',
}: DurationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, showBelow: true });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // 计算下拉菜单位置 - 使用视口坐标（position: fixed）
  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = Math.min(options.length * 44 + 16, 280); // 最大高度估算

      // 判断下方空间是否足够
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const showBelow = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove;

      setDropdownPosition({
        top: showBelow ? rect.bottom + 4 : rect.top - dropdownHeight - 4,
        left: rect.left,
        width: rect.width,
        showBelow,
      });
    }
  }, [options.length]);

  // 使用 requestAnimationFrame 优化滚动更新
  const scheduleUpdate = useCallback(() => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      updatePosition();
    });
  }, [updatePosition]);

  // 打开下拉菜单时计算位置
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      // 高亮当前选中的选项
      const currentIndex = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [isOpen, value, options, updatePosition]);

  // 监听窗口滚动和大小变化，更新位置
  useEffect(() => {
    if (!isOpen) return;

    // 使用 capture 阶段监听所有滚动事件
    window.addEventListener('scroll', scheduleUpdate, true);
    window.addEventListener('resize', updatePosition);

    // 监听各种可能导致布局变化的事件
    document.addEventListener('visibilitychange', updatePosition);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate, true);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('visibilitychange', updatePosition);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [isOpen, scheduleUpdate, updatePosition]);

  // 点击外部关闭
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => 
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case 'Home':
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
    }
  };

  const handleSelect = (optionValue: number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <>
      {/* 触发器按钮 */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        onKeyDown={handleKeyDown}
        className={`
          relative flex items-center justify-between gap-2
          min-w-[120px] px-3 py-2
          bg-warm hover:bg-warm/80
          rounded-xl border-0
          text-sm text-charcoal font-medium
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-coral/30
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? 'ring-2 ring-coral/30 bg-warm/80' : ''}
          ${className}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-activedescendant={highlightedIndex >= 0 ? `duration-option-${highlightedIndex}` : undefined}
      >
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone" />
          <span>{selectedOption?.label || placeholder}</span>
        </span>
        <ChevronDown 
          className={`
            w-4 h-4 text-stone transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `} 
        />
      </button>

      {/* 下拉菜单 - 使用Portal渲染到body，position: fixed 相对于视口 */}
      {isOpen && (
        <Portal>
          <div
            ref={dropdownRef}
            className="fixed z-[9999]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            <div 
              className={`
                bg-white rounded-xl shadow-xl border border-mist/50
                py-2 max-h-[280px] overflow-auto
                transition-all duration-150 ease-out
                origin-top
                ${dropdownPosition.showBelow ? 'animate-in fade-in zoom-in-95 slide-in-from-top-1' : 'animate-in fade-in zoom-in-95 slide-in-from-bottom-1'}
              `}
            >
              <ul role="listbox" className="m-0 p-0 list-none">
                {options.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <li
                      key={option.value}
                      id={`duration-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`
                        px-3 py-2.5 mx-1.5 rounded-lg cursor-pointer
                        text-sm transition-colors duration-150
                        flex items-center justify-between
                        ${isSelected 
                          ? 'bg-coral/10 text-coral font-medium' 
                          : isHighlighted 
                            ? 'bg-warm text-charcoal' 
                            : 'text-charcoal hover:bg-warm'
                        }
                      `}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-coral"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

export default DurationSelect;
