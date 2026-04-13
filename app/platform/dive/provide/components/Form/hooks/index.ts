import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {useCallback} from 'react';

import {buildListingSchema} from '@/lib/db/schemas/validators/listing';
import {FieldSchema} from '@/lib/db/schemas/platform';
import {usePlatform} from '@/app/providers/platform';

export default function useEnhance() {
    const platform = usePlatform();
    const schema = platform.listingSchemas.offer;
    const router   = useRouter()

    const zodSchema = buildListingSchema(schema)

    const { handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(zodSchema),
        defaultValues: Object.fromEntries(
            schema.map(f => [f.key, f.type === 'multiselect' ? [] : ''])
        )
    })

    const { mutate: createListing } = useMutation({
        mutationFn: async (fields: Record<string, unknown>) => {
            const res = await fetch('/api/listings', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    platformId:  platform.id,
                    listingType: 'offer',
                    fields,
                })
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.errors ? Object.values(err.errors).flat().join(', ') : 'Failed to create listing')
            }
            return res.json()
        },
        onSuccess: () => {
            router.push(`/platform/dive`)
        },
        onError: (err) => {
            console.error(err.message)
        }
    });

    const getFieldValue = useCallback((field: FieldSchema) => watch(field.key), [watch])

    const getFieldError = useCallback(
        (field: FieldSchema): string | undefined => errors[field.key]?.message as string | undefined,
        [errors],
    )

    const setFieldValue = useCallback((field: FieldSchema, value: unknown) => {
        setValue(field.key, value, { shouldValidate: true })
    }, [setValue])

    const onSubmit = useCallback((data: Record<string, unknown>) => {
        createListing(data)
    }, [createListing])

    return {
        schema,
        getFieldValue,
        setFieldValue,
        getFieldError,
        handleSubmit,
        onSubmit,
    }
}