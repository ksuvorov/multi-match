import { z } from 'zod'

import type { FieldSchema } from '../platform'

export function splitListingFields(fields: Record<string, unknown>, fieldSchema: FieldSchema[]) {
    const columns: Record<string, unknown> = {}
    const meta:    Record<string, unknown> = {}

    for (const f of fieldSchema) {
        const value = fields[f.key]
        if (f.column) {
            columns[f.column] = value
        }
        if (f.radiusColumn && typeof value === 'object' && value !== null) {
            columns[f.radiusColumn] = (value as Record<string, unknown>).radiusKm ?? null
        }
        if (!f.column && !f.radiusColumn) {
            meta[f.key] = value
        }
    }

    return { columns, meta }
}

function fieldToZod(field: FieldSchema): z.ZodTypeAny {
    switch (field.type) {
        case 'text':
            return field.required
                ? z.string().min(1, 'Required')
                : z.string().optional().or(z.literal(''))

        case 'number':
            return field.required
                ? z.coerce.number()
                : z.coerce.number().optional()

        case 'select':
            const selectBase = field.options?.length
                ? z.enum(field.options as [string, ...string[]])
                : z.string()
            return field.required ? selectBase : selectBase.optional()

        case 'multiselect':
            const msBase = field.options?.length
                ? z.array(z.enum(field.options as [string, ...string[]]))
                : z.array(z.string())
            return field.required ? msBase.min(1, 'Required') : msBase

        case 'date':
            return z.string().optional().or(z.literal(''))

        case 'location':
            const locBase = z.object({
                lat:      z.number(),
                lng:      z.number(),
                radiusKm: z.number().optional(),
            })
            return field.required ? locBase : locBase.optional()

        default:
            return z.unknown()
    }
}

export function buildListingSchema(fieldSchemas: FieldSchema[]) {
    const shape: Record<string, z.ZodTypeAny> = {}

    for (const field of fieldSchemas) {
        shape[field.key] = fieldToZod(field)
    }

    return z.object(shape)
}