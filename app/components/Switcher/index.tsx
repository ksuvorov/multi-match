import { memo, ReactNode } from 'react'

type Option = {
    id: string,
    label: string,
    icon?: ReactNode,
}
type Props = {
    options: Option[],
    activeId: string | null,
    onChange: (id: string) => void,
}
export default memo(function Switcher({options, activeId, onChange}: Props) {
    return (
        <div className="flex gap-1 bg-[#f2f2f7] p-1 rounded-2xl">
            {options.map((option) => {
                const active = activeId === option.id;
                return (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={[
                            'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                            active
                                ? 'bg-[#0a84ff] text-white shadow-md'
                                : 'text-[#8e8e93] hover:text-[#1c1c1e]',
                        ].join(' ')}
                    >
                        {option.icon && <span>{option.icon}</span>}
                        <span>{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
})