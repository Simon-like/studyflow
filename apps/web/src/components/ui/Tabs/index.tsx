import type { TabsProps } from './types';

const VARIANT_CLASSES = {
  default: {
    container: 'border-b border-mist',
    tab: 'px-5 py-2 border-b-2 transition-all',
    active: 'border-coral text-coral',
    inactive: 'border-transparent text-stone hover:text-charcoal',
  },
  pill: {
    container: 'flex gap-2',
    tab: 'px-5 py-2 rounded-xl text-sm font-medium transition-all',
    active: 'bg-coral text-white shadow-coral',
    inactive: 'bg-white text-stone hover:bg-warm border border-mist',
  },
};

export function Tabs({
  items,
  activeKey,
  onChange,
  variant = 'pill',
  className = '',
}: TabsProps) {
  const styles = VARIANT_CLASSES[variant];

  return (
    <div className={`${styles.container} ${className}`}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`${styles.tab} ${
            activeKey === item.key ? styles.active : styles.inactive
          }`}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
            {item.count !== undefined && (
              <span className="text-xs opacity-70">({item.count})</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

export { type TabsProps, type TabItem } from './types';
