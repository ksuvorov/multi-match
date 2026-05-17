import Link from 'next/link'

type Props = {
    title: string
    subtitle?: string
} & (
    | { href: string; onClick?: never }
    | { onClick: () => void; href?: never }
)

export default function ActionCard({ title, subtitle, href, onClick }: Props) {
    const content = (
        <>
            <span className="text-base font-semibold text-foreground">{title}</span>
            {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
        </>
    )

    const className = 'flex-1 flex items-center justify-center flex-col gap-1 rounded-2xl bg-muted hover:bg-muted/80 active:bg-muted/60 transition-colors duration-200 p-6 text-center'

    if (href) {
        return <Link href={href} className={className}>{content}</Link>
    }

    return (
        <button onClick={onClick} className={className}>
            {content}
        </button>
    )
}