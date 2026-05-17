import { cn } from '@/lib/utils'

import { inputClass, type FieldInputProps } from '../../shared'

export function DateField({ value, onChange, error }: FieldInputProps<string>) {
    return (
        <div className="flex">
            <input
                type="date"
                className={cn(inputClass, error && "border-destructive")}
                value={value ?? ''}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    )
}