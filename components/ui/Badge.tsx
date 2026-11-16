import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'bg-[--color-surface] text-[--color-text-muted]',
        accent: 'bg-[#FFF0ED] text-[#FF3B00]',
        green: 'bg-green-100 text-green-700',
        red: 'bg-red-100 text-red-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  label: string;
  className?: string;
}

export function Badge({ label, variant, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>{label}</span>
  );
}

