'use client'

import {DynamicField} from '@/app/components/DynamicField';
import useListingForm from '@/lib/hooks/useListingForm';

type ListingType = 'offer' | 'request';

interface Props {
    listingType: ListingType;
    submitLabel?: string;
    onSuccess?: () => void;
}

export default function ListingForm({listingType, submitLabel = 'Submit', onSuccess}: Props) {
    const {
        schema,
        getFieldValue,
        setFieldValue,
        getFieldError,
        handleSubmit,
        onSubmit,
    } = useListingForm(listingType, onSuccess);

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