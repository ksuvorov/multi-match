import { z } from 'zod'

import type { FieldSchema } from '../platform'

export function splitListingFields(fields: Record<string, unknown>, fieldSchema: FieldSchema[]) {
    const columns: Record<string, unknown> = {}
    const meta:    Record<string, unknown> = {}

    for (const f of fieldSchema) {
        const value = fields[f.key]
        if (f.column) {
            columns[f.column] = value
        } else {
            meta[f.key] = value
        }
    }

    return { columns, meta }
}

function fieldToZod(field: FieldSchema): z.ZodTypeAny {
    let schema: z.ZodTypeAny

    switch (field.type) {
        case 'text':
            schema = z.string()
            break
        case 'number':
            schema = z.coerce.number()
            break
        case 'select':
            schema = field.options?.length
                ? z.enum(field.options as [string, ...string[]])
                : z.string()
            break
        case 'multiselect':
            schema = field.options?.length
                ? z.array(z.enum(field.options as [string, ...string[]]))
                : z.array(z.string())
            break
        case 'date':
            schema = z.string().optional().or(z.literal(''))
            break
        case 'location':
            schema = z.object({ lat: z.number(), lng: z.number() })
                .or(z.string().transform(val => {
                    const [lat, lng] = val.split(',').map(Number)
                    return { lat, lng }
                }))
            break
        default:
            schema = z.unknown()
    }

    return field.required ? schema : schema.optional()
}

export function buildListingSchema(fieldSchemas: FieldSchema[]) {
    const shape: Record<string, z.ZodTypeAny> = {}

    for (const field of fieldSchemas) {
        shape[field.key] = fieldToZod(field)
    }

    return z.object(shape)
}