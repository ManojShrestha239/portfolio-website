import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs font-mono text-xs uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-45 cursor-pointer',
    {
        variants: {
            variant: {
                default:
                    'border border-ink bg-ink text-canvas hover:bg-ink/90',
                accent:
                    'border border-accent bg-accent text-canvas hover:bg-accent/90',
                outline:
                    'border border-hairline bg-surface/80 text-ink hover:border-ink-muted hover:bg-surface-hover',
                ghost:
                    'border border-transparent text-ink-secondary hover:text-ink hover:bg-surface/60',
            },
            size: {
                default: 'h-10 px-5 py-2',
                sm: 'h-8 px-3.5 text-[11px]',
                lg: 'h-12 px-7 text-xs',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Component = asChild ? Slot : 'button';
        return (
            <Component
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            />
        );
    },
);

Button.displayName = 'Button';
