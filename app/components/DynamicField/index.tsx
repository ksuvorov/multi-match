'use client'

import type { FieldSchema } from '@/lib/db/schemas/platform'

import { LocationField } from './components/Location'
import { NumberField } from './components/Number'
import { TextField } from './components/Text'
import { DateField } from './components/Date'

type Props = {
    field:    FieldSchema
    value:    unknown
    onChange: (value: unknown) => void
    error?:   string
}

export function DynamicField({ field, value, onChange, error }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
                {field.label}{field.required && ' *'}
            </label>

            {field.type === 'text' && (
                <TextField value={value as string} onChange={onChange} error={error} />
            )}
            {field.type === 'number' && (
                <NumberField value={value as number} onChange={onChange} error={error} />
            )}
            {field.type === 'date' && (
                <DateField value={value as string} onChange={onChange} error={error} />
            )}
            {field.type === 'location' && (
                <LocationField value={value as string} onChange={onChange} error={error} />
            )}

            {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
    )
}