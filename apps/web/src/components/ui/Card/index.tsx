import type { CardProps, CardHeaderProps, CardFooterProps } from './types';
import { CARD_PADDING, CARD_SHADOW, CARD_BASE_CLASSES } from './constants';

export function Card({
  children,
  padding = 'md',
  shadow = 'soft',
  hover = false,
  className = '',
  ...props
}: CardProps) {
  const classes = [
    CARD_BASE_CLASSES,
    CARD_PADDING[padding],
    CARD_SHADOW[shadow],
    hover ? 'hover:-translate-y-0.5 hover:shadow-medium cursor-pointer' : '',
    className,
  ].join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="font-semibold text-charcoal">{title}</h2>
        {subtitle && <p className="text-stone text-xs mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className="mt-4 pt-4 border-t border-mist/20">{children}</div>;
}

export { type CardProps, type CardHeaderProps, type CardFooterProps } from './types';
