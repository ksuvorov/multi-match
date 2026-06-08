import { ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type CardProps = {
    tags?:        ReactNode
    title:        string | null
    description?: string | null
    footer?:      ReactNode
    className?:   string
    disabled?:    boolean
    onClick?:     () => void
}

export function Card({ tags, title, description, footer, className, disabled, onClick }: CardProps) {
    const clickable = !disabled && !!onClick
    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={cn(
                'rounded-lg border bg-white/[0.04] px-4 py-3.5',
                disabled ? 'border-border/40 opacity-50' : 'border-border',
                clickable && [
                    'cursor-pointer transition-all duration-200',
                    'hover:bg-brand-subtle hover:border-border-strong',
                    'active:scale-[0.99]',
                ],
                className,
            )}
        >
            <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {tags && (
                        <div className="flex items-center gap-2">{tags}</div>
                    )}

                    <p className={cn(
                        'font-sans font-bold text-[14px] leading-snug text-balance',
                        disabled ? 'text-fg-muted' : 'text-fg',
                    )}>
                        {title}
                    </p>

                    {description && (
                        <p className="font-sans text-[12px] leading-relaxed text-fg-muted line-clamp-2">
                            {description}
                        </p>
                    )}

                    {footer && (
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-fg-muted pt-1.5">
                            {footer}
                        </div>
                    )}
                </div>

                {clickable && (
                    <div className="shrink-0 w-[18px] h-[18px] rounded-full bg-brand-subtle flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-fg-muted" />
                    </div>
                )}
            </div>
        </div>
    )
}