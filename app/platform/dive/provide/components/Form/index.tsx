'use client'

import {DynamicField} from '@/app/components/DynamicField';

import useEnhance from './hooks';

export default function Form() {
    const {
        schema,
        getFieldValue,
        setFieldValue,
        getFieldError,
        handleSubmit,
        onSubmit,
    } = useEnhance();

    return (
        <div>
            {schema.map(field => (
                <DynamicField
                    key={field.key}
                    field={field}
                    value={getFieldValue(field)}
                    onChange={value => setFieldValue(field, value)}
                    error={getFieldError(field)}
                />
            ))}

            <button type="button" onClick={handleSubmit(onSubmit)}>
                Create listing
            </button>
        </div>
    )
}