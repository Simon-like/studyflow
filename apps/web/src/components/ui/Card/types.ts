import type { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'soft' | 'medium' | 'strong';
  hover?: boolean;
}

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export interface CardFooterProps {
  children: ReactNode;
}
