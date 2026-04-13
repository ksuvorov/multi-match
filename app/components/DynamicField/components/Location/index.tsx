import { cn } from '@/lib/utils'

import { inputClass, type FieldInputProps } from '../../shared'

type Location = { lat: number; lng: number }

export function LocationField({ value, onChange, error }: FieldInputProps<Location | string>) {
    return (
        <input
            className={cn(inputClass, error && "border-destructive")}
            placeholder="lat, lng"
            defaultValue={typeof value === 'object' ? `${value.lat}, ${value.lng}` : value ?? ''}
            onChange={e => {
                const [lat, lng] = e.target.value.split(',').map(Number)
                if (!isNaN(lat) && !isNaN(lng)) onChange({ lat, lng })
                else onChange(e.target.value)
            }}
        />
    )
}