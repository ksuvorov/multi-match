'use client'

import {FieldSchema, WizardStep} from '@/lib/db/schemas/platform';
import {useWizardSteps} from '@/lib/hooks/useWizardSteps';
import {DynamicField} from '@/app/components/DynamicField';
import useListingForm from '@/lib/hooks/useListingForm';
import Button from '@/app/components/Button';

interface Props {
    role: string;
    submitLabel?: string;
    onSuccess?: () => void;
}

export default function ListingForm({role, submitLabel = 'Submit', onSuccess}: Props) {
    const {
        steps,
        getFieldValue,
        setFieldValue,
        getFieldError,
        handleSubmit,
        onSubmit,
        isPending,
    } = useListingForm(role, onSuccess);

    const { step, total, next, prev } = useWizardSteps(steps);

    const renderStep = (s: WizardStep) => (
        <div className="mb-8">
            {s.title && <h2 className="text-lg font-medium mb-4">{s.title}</h2>}
            {renderFields(s.fields)}
        </div>
    )

    const renderFields = (fields: FieldSchema[]) =>
        fields.map(field => (
            <DynamicField
                key={field.key}
                field={field}
                value={getFieldValue(field)}
                onChange={value => setFieldValue(field, value)}
                error={getFieldError(field)}
            />
        ))

    return (
        <div>
            {/* Desktop: previous steps */}
            <div className="hidden md:block">
                {steps.slice(0, step).map((s, i) => (
                    <div key={i}>
                        {renderStep(s)}
                        <hr className="mt-6" />
                    </div>
                ))}
            </div>

            {/* Current step: both mobile and desktop */}
            {renderStep(steps[step])}

            <div className="flex gap-2 mt-4">
                {step > 0 && (
                    <Button variant="secondary" className="md:hidden" onClick={prev}>Back</Button>
                )}
                {!(step === total - 1) ? (
                    <Button onClick={next} stretch>Next</Button>
                ) : (
                    <Button onClick={handleSubmit(onSubmit)} stretch loading={isPending}>{submitLabel}</Button>
                )}
            </div>
        </div>
    )
}