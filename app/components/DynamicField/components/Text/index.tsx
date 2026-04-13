import { cn } from '@/lib/utils'

import { inputClass, type FieldInputProps } from '../../shared'

export function TextField({ value, onChange, error }: FieldInputProps<string>) {
    return (
        <input
            className={cn(inputClass, error && "border-destructive")}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
        />
    );
}