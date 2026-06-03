import { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { approveMatch } from '@/app/actions/approveMatch';
import { rejectMatch } from '@/app/actions/rejectMatch';

import { Props } from './types';

export const useEnhance = ({ match }: Props) => {
    const router = useRouter();

    const {
        match: m,
        myListing, myApprovedAt, myRejectedAt,
        counterpart, counterpartApprovedAt, counterpartRejectedAt,
        counterpartContact,
    } = match;

    const iApproved = !!myApprovedAt;
    const isRejected = !!myRejectedAt || !!counterpartRejectedAt;
    const isConfirmed = !!myApprovedAt && !!counterpartApprovedAt;
    const canAct = !isRejected && !isConfirmed && !iApproved;

    const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
    const [contact, setContact] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleApprove() {
        setLoading('approve');
        try {
            const res = await approveMatch(m.id, contact.trim());
            if (!res.ok) return;
            router.refresh();
        } finally {
            setLoading(null);
        }
    }

    async function handleReject() {
        setLoading('reject')
        try {
            const res = await rejectMatch(m.id);
            if (!res.ok) return;
            router.push('/platform/dive/dashboard')
        } finally {
            setLoading(null)
        }
    }

    function toTheDashboard() {
        router.push('/platform/dive/dashboard')
    }

    function onChangeContact(e: ChangeEvent<HTMLInputElement>) {
        setContact(e.target.value)
    }

    return {
        inputRef,
        toTheDashboard,
        handleApprove, handleReject,
        myListing, myApprovedAt, myRejectedAt,
        counterpart, counterpartApprovedAt, counterpartRejectedAt,
        contact, onChangeContact,
        iApproved,
        isConfirmed, isRejected,
        counterpartContact,
        loading,
        canAct,
    }
}