export const inputClass = "w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"

export type FieldInputProps<T> = {
    value: T
    onChange: (v: T) => void
    error?: string
}