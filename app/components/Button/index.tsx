import { memo, ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

type BaseProps = {
    children: ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    icon?: ReactNode
    iconPosition?: 'left' | 'right'
    stretch?: boolean
    className?: string
    href?: string
    disabled?: boolean
}

type Props = BaseProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>

const variantStyles: Record<ButtonVariant, { base: string; disabled: string }> = {
    primary: {
        base: 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 active:bg-primary/80',
        disabled: 'opacity-50',
    },
    secondary: {
        base: 'bg-muted text-foreground hover:bg-muted/80 active:bg-muted/60',
        disabled: 'opacity-50',
    },
    ghost: {
        base: 'bg-transparent text-primary hover:bg-primary/10 active:bg-primary/20',
        disabled: 'opacity-50',
    },
    destructive: {
        base: 'bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 active:bg-destructive/80',
        disabled: 'opacity-50',
    },
}

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-1.5',
    lg: 'px-5 py-2.5 text-base gap-2',
}

const loaderSize: Record<ButtonSize, number> = {
    sm: 12,
    md: 14,
    lg: 16,
}

export default memo(function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    stretch = false,
    disabled,
    className,
    href,
    ...props
}: Props) {
    const isDisabled = disabled || loading
    const styles = variantStyles[variant]

    const classes = [
        'flex items-center justify-center rounded-xl font-semibold transition-all duration-200 select-none',
        sizeStyles[size],
        isDisabled ? `${styles.disabled} cursor-not-allowed` : `${styles.base} cursor-pointer`,
        stretch ? 'w-full' : 'w-fit',
        className,
    ].join(' ')

    const content = (
        <>
            {loading ? (
                <svg
                    width={loaderSize[size]}
                    height={loaderSize[size]}
                    viewBox="0 0 16 16"
                    fill="none"
                    className="animate-spin shrink-0"
                >
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ) : (
                icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
            )}
            <span>{children}</span>
            {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
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