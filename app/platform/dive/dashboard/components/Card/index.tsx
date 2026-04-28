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
                "rounded-xl border border-border/40 bg-card px-5 py-4 transition-colors hover:border-border/70",
                className
            )}
        >
            {tags && <div className="mb-3 flex items-center gap-2">{tags}</div>}
            <p className="mb-1 text-base font-medium text-foreground">{title}</p>
            {description && (
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            )}
            {footer && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {footer}
                </div>
            )}
        </div>
    )
}