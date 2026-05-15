import { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface DashboardCardProps {
    tags?: ReactNode
    title: string | null
    description: string | null
    footer?: ReactNode
    className?: string
}

export function Card({
  tags,
  title,
  description,
  footer,
  className,
}: DashboardCardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-border/50 bg-card px-4 py-4",
                "shadow-sm shadow-black/[0.04]",
                "transition-all duration-200 hover:border-border hover:shadow-md hover:shadow-black/[0.07]",
                "active:scale-[0.99]",
                className
            )}
        >
            {tags && (
                <div className="mb-2.5 flex items-center gap-2">
                    {tags}
                </div>
            )}
            <p className="mb-1 text-[15px] font-semibold leading-snug text-foreground text-balance">
                {title}
            </p>
            {description && (
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {description}
                </p>
            )}
            {footer && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border/40 pt-3 mt-1">
                    {footer}
                </div>
            )}
        </div>
    )
}
