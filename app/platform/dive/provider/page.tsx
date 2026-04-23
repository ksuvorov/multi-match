'use client'

import {useRouter} from 'next/navigation';

import ListingForm from '@/app/components/ListingForm';

export default function ProvidePage() {
    const router = useRouter()
    return (
        <ListingForm
            role="provider"
            submitLabel="Create listing"
            onSuccess={() => router.push('/platform/dive')}
        />
    )
}