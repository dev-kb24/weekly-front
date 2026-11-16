import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent',
        secondary: 'bg-surface text-text hover:bg-[#EFEFEF] focus:ring-border',
        ghost: 'bg-transparent text-text-muted hover:bg-surface hover:text-text focus:ring-border',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        fab: 'bg-accent text-white hover:bg-accent-hover active:scale-95 focus:ring-accent',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
