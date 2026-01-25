import { ReactNode } from 'react';

type BadgeVariant = 'success' | 'error' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success border-success/20',
  error: 'bg-error-bg text-error border-error/20',
  neutral: 'bg-bg-tertiary text-text-secondary border-border',
};

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        border ${variantStyles[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}
