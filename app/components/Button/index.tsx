import { memo, ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react';
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

type BaseProps = {
    children?: ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    stretch?: boolean
    className?: string
    href?: string
    disabled?: boolean
}

type Props = BaseProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>

const variantStyles: Record<ButtonVariant, { base: string; interactive: string; disabled: string }> = {
    primary: {
        base: 'bg-brand text-brand-fg font-extrabold',
        interactive: 'hover:opacity-90 active:opacity-80',
        disabled: 'opacity-50',
    },
    secondary: {
        base: 'bg-surface-raised text-fg font-bold border border-border',
        interactive: 'hover:border-border-strong hover:bg-surface-overlay active:bg-surface-overlay',
        disabled: 'opacity-50',
    },
    ghost: {
        base: 'bg-transparent text-brand font-bold',
        interactive: 'hover:bg-brand-subtle active:bg-brand-muted',
        disabled: 'opacity-50',
    },
    destructive: {
        base: 'bg-danger-muted text-danger font-bold border border-danger/20',
        interactive: 'hover:bg-danger/15 active:bg-danger/20',
        disabled: 'opacity-50',
    },
}

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2.5 text-sm gap-1.5',
    lg: 'px-5 py-3 text-sm gap-2',
    icon: 'w-9 h-9 p-0 gap-0',
}

const loaderSize: Record<ButtonSize, number> = {
    sm: 12,
    md: 14,
    lg: 16,
    icon: 16,
}

export default memo(function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    stretch = false,
    disabled,
    className,
    href,
    ...props
}: Props) {
    const isDisabled = disabled || loading
    const v = variantStyles[variant]

    const classes = [
        'flex items-center justify-center transition-all duration-200 select-none',
        size === 'icon' ? 'rounded-full' : 'rounded-lg',
        sizeStyles[size],
        v.base,
        isDisabled
            ? `${v.disabled} cursor-not-allowed`
            : `${v.interactive} cursor-pointer`,
        stretch && size !== 'icon' ? 'w-full' : '',
        !stretch && size !== 'icon' ? 'w-fit' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    const content = loading ? (
        <>
            <Loader2 size={loaderSize[size]} className="animate-spin shrink-0" />
            {children}
        </>
    ) : (
        children
    )

    if (href !== undefined) {
        return (
            <Link href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {content}
            </Link>
        )
    }

    return (
        <button
            disabled={isDisabled}
            className={classes}
            {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {content}
        </button>
    )
})