'use client'

import { useRouter } from 'next/navigation';

import { FieldSchema, WizardStep } from '@/lib/db/schemas/platform';
import { useWizardSteps } from '@/lib/hooks/useWizardSteps';
import { DynamicField } from '@/app/components/DynamicField';
import useListingForm from '@/lib/hooks/useListingForm';
import Button from '@/app/components/Button';
import {ArrowLeftIcon} from 'lucide-react';

interface Props {
    role: string;
    submitLabel?: string;
    onSuccess?: () => void;
}

export default function ListingForm({role, submitLabel = 'Submit', onSuccess}: Props) {
    const router = useRouter();
    const {
        steps,
        getFieldValue,
        setFieldValue,
        getFieldError,
        handleSubmit,
        onSubmit,
        isPending,
        isNavigating,
    } = useListingForm(role, onSuccess);

    const { step, total, next, prev } = useWizardSteps(steps);

    const renderStep = (s: WizardStep) => (
        <div className="flex flex-col flex-1 w-full min-w-0 p-4 pb-0 gap-4">
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
        <div className="min-h-full flex flex-col">
            <div className="hidden md:block">
                {steps.slice(0, step).map((s, i) => (
                    <div key={i}>
                        {renderStep(s)}
                        <hr className="mt-6" />
                    </div>
                ))}
            </div>

            {renderStep(steps[step])}

            <div className="flex gap-2 p-4">
                {step > 0
                    ? (
                        <Button variant="secondary" className="md:hidden" onClick={prev}>
                            <ArrowLeftIcon />
                        </Button>
                    ) : (
                        <Button variant="secondary" className="md:hidden" onClick={router.back}>
                            <ArrowLeftIcon />
                        </Button>
                    )
                }
                {!(step === total - 1) ? (
                    <Button variant="primary" onClick={next} stretch>Next</Button>
                ) : (
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} stretch loading={isPending || isNavigating}>{submitLabel}</Button>
                )}
            </div>
        </div>
    )
}