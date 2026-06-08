'use client'

import type { FieldSchema } from '@/lib/db/schemas/platform'

import { GeoLocation } from './components/Location/types';
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
        <div className={`flex flex-col gap-1.5 min-w-0 ${field.type === 'location' ? 'flex-1 min-h-0 -mx-4 -mt-4 w-screen' : 'w-full'}`}>
            {field.label && (
                <label className="font-mono text-[10px] tracking-widest uppercase text-fg-muted flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-brand">*</span>}
                </label>
            )}
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
                <LocationField value={value as GeoLocation} onChange={onChange} error={error} />
            )}

            {error && <span className="text-xs font-mono text-danger">{error}</span>}
        </div>
    )
}