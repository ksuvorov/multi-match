'use client'

import {DynamicField} from '@/app/components/DynamicField';
import useListingForm from '@/lib/hooks/useListingForm';

interface Props {
    role: string;
    submitLabel?: string;
    onSuccess?: () => void;
}

export default function ListingForm({role, submitLabel = 'Submit', onSuccess}: Props) {
    const {
        schema,
        getFieldValue,
        setFieldValue,
        getFieldError,
        handleSubmit,
        onSubmit,
    } = useListingForm(role, onSuccess);

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
                {submitLabel}
            </button>
        </div>
    )
}