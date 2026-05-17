import { memo, ReactNode } from 'react'

type Option = {
    id: string,
    label: string,
    icon?: ReactNode,
    badge?: ReactNode,
}
type Props = {
    options: Option[],
    activeId: string | null,
    onChange: (id: string) => void,
    stretch?: boolean,
}
export default memo(function Switcher({options, activeId, onChange, stretch}: Props) {
    return (
        <div
            className={[
                'gap-1 bg-muted p-1 rounded-2xl',
                stretch ? 'grid w-full' : 'flex w-fit',
            ].join(' ')}
            style={stretch ? { gridTemplateColumns: `repeat(${options.length}, 1fr)` } : undefined}
        >
            {options.map((option) => {
                const active = activeId === option.id;
                return (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={[
                            'flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                            active
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'text-muted-foreground hover:text-foreground',
                        ].join(' ')}
                    >
                        {option.icon && <span>{option.icon}</span>}
                        <span>{option.label}</span>
                        {option.badge && <span>{option.badge}</span>}
                    </button>
                )
            })}
        </div>
    )
})