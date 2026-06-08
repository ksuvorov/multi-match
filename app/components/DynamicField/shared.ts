export const inputClass = "w-full min-w-0 rounded-md border border-border bg-input px-3.5 py-3 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-border-strong transition-colors"

export type FieldInputProps<T> = {
    value: T
    onChange: (v: T) => void
    error?: string
}