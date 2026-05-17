import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {useForm} from 'react-hook-form';
import {useCallback} from 'react';

import {buildListingSchema} from '@/lib/db/schemas/validators/listing';
import {FieldSchema, WizardStep} from '@/lib/db/schemas/platform';
import {usePlatform} from '@/app/providers/platform';

export default function useListingForm(role: string, onSuccess?: () => void) {
    const platform = usePlatform();
    const steps: WizardStep[] = platform.listingSchemas[role];
    const fields: FieldSchema[] = steps.flatMap(s => s.fields);

    const zodSchema = buildListingSchema(fields);

    const {handleSubmit, setValue, watch, formState: {errors}} = useForm({
        resolver: zodResolver(zodSchema),
        defaultValues: Object.fromEntries(
            fields.map(f => [f.key, f.type === 'multiselect' ? [] : ''])
        )
    });

    const {mutate: createListing, isPending} = useMutation({
        mutationFn: async (fields: Record<string, unknown>) => {
            const res = await fetch('/api/listings', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    platformId: platform.id,
                    role,
                    fields,
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.errors ? Object.values(err.errors).flat().join(', ') : 'Failed to create listing');
            }
            return res.json();
        },
        onSuccess: () => {
            onSuccess?.();
        },
        onError: (err) => {
            console.error(err.message);
        }
    });

    const getFieldValue = useCallback((field: FieldSchema) => watch(field.key), [watch]);

    const getFieldError = useCallback(
        (field: FieldSchema): string | undefined => errors[field.key]?.message as string | undefined,
        [errors],
    );

    const setFieldValue = useCallback((field: FieldSchema, value: unknown) => {
        setValue(field.key, value, {shouldValidate: true});
    }, [setValue]);

    const onSubmit = useCallback((data: Record<string, unknown>) => {
        createListing(data);
    }, [createListing]);

    return {
        steps,
        getFieldValue,
        setFieldValue,
        getFieldError,
        handleSubmit,
        onSubmit,
        isPending,
    };
}