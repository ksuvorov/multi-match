import { useState } from 'react'

import { WizardStep } from '@/lib/db/schemas/platform'

export function useWizardSteps(steps: WizardStep[]) {
    const [step, setStep] = useState(0)

    const total = steps.length

    const next = () => setStep(s => Math.min(s + 1, total - 1))
    const prev = () => setStep(s => Math.max(s - 1, 0))

    return {
        step,
        total,
        next,
        prev,
    }
}