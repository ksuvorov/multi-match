import { memo, ReactNode } from 'react'

type Option = {
    id:     string
    label:  string
    icon?:  ReactNode
    badge?: number
}

type Props = {
    options:  Option[]
    activeId: string | null
    onChange: (id: string) => void
    stretch?: boolean
    variant?: 'primary' | 'tabs'
}

type VariantStyle = {
    track:         string
    button:        string
    active:        string
    inactive:      string
    badgeActive:   string
    badgeInactive: string
}

const variantStyles: Record<NonNullable<Props['variant']>, VariantStyle> = {
    primary: {
        track:         'flex items-center gap-1',
        button:        'flex items-center gap-1.5 px-4 py-2 rounded-4xl text-sm font-bold transition-all duration-200 cursor-pointer select-none',
        active:        'bg-brand text-brand-fg',
        inactive:      'text-fg-muted hover:text-fg',
        badgeActive:   'bg-brand-fg text-brand',
        badgeInactive: 'bg-white/[0.08] text-fg-muted',
    },
    tabs: {
        track:         'flex bg-white/[0.03] p-[3px] rounded-[10px]',
        button:        'flex-1 flex items-center justify-center gap-1.5 px-3 py-[7px] rounded-[8px] font-mono text-[11px] font-bold transition-all duration-200 cursor-pointer select-none',
        active:        'bg-brand text-brand-fg',
        inactive:      'text-fg-muted',
        badgeActive:   'bg-brand-fg text-brand',
        badgeInactive: 'bg-white/[0.08] text-fg-muted',
    },
}

export default memo(function Switcher({
    options,
    activeId,
    onChange,
    stretch,
    variant = 'primary',
}: Props) {
    const s = variantStyles[variant]

    return (
        <div className={[s.track, stretch ? 'w-full' : 'w-fit'].join(' ')}>
            {options.map((option) => {
                const active = activeId === option.id

                return (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={[s.button, active ? s.active : s.inactive].join(' ')}
                    >
                        {option.icon && <span className="shrink-0">{option.icon}</span>}

                        <span>{option.label}</span>

                        {option.badge !== undefined && (
                            <span className={[
                                'inline-flex items-center justify-center',
                                'min-w-[18px] h-[18px] px-1',
                                'font-mono text-[10px] font-bold rounded-full',
                                active ? s.badgeActive : s.badgeInactive,
                            ].join(' ')}>
                                {option.badge}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
})