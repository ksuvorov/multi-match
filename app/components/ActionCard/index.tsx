import Link from 'next/link'

type Props = {
    title: string
    subtitle?: string
    icon?: string
} & (
    | { href: string; onClick?: never }
    | { onClick: () => void; href?: never }
)

export default function ActionCard({ title, subtitle, icon, href, onClick }: Props) {
    const className = [
        'group relative flex-1 flex items-center justify-center flex-col gap-1',
        'rounded-xl p-6 text-center cursor-pointer overflow-hidden',
        'border border-border bg-white/[0.04]',
        'transition-colors duration-200',
        'hover:border-border-strong hover:bg-brand-subtle',
        'active:bg-brand-muted',
    ].join(' ')

    const inner = (
        <>
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: 'radial-gradient(ellipse at 50% 110%, var(--brand-muted) 0%, transparent 70%)',
                }}
            />
            <span className="relative z-10 flex flex-col items-center gap-1">
                {icon && <span className="text-4xl mb-1">{icon}</span>}
                <span className="text-[17px] font-extrabold tracking-tight text-fg">{title}</span>
                {subtitle && <span className="text-xs text-fg-muted mt-0.5">{subtitle}</span>}
            </span>
        </>
    )

    if (href) {
        return <Link href={href} className={className}>{inner}</Link>
    }

    return (
        <button onClick={onClick} className={className}>
            {inner}
        </button>
    )
}