import { cn } from '@/lib/utils'

import { inputClass, type FieldInputProps } from '../../shared'

export function NumberField({ value, onChange, error }: FieldInputProps<number>) {
    return (
        <input
            type="number"
            className={cn(inputClass, error && "border-destructive")}
            value={value ?? ''}
            onChange={e => onChange(Number(e.target.value))}
        />
    )
}