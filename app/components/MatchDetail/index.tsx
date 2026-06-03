'use client'

import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

import Button from '@/app/components/Button';

import MapSkeleton from './components/IntersectionMap/skeleton'
import Contacts from './components/Contacts';
import Listing from './components/Listing';

import {useEnhance} from './hooks';
import { Props } from './types';

const IntersectionMap = dynamic(() => import('./components/IntersectionMap'), {
    ssr: false,
    loading: () => <MapSkeleton />,
})

export function MatchDetail(props: Props) {
    const {
        inputRef,
        toTheDashboard,
        loading,
        myListing, myApprovedAt, myRejectedAt,
        counterpart, counterpartApprovedAt, counterpartRejectedAt,
        contact, onChangeContact,
        counterpartContact,
        isConfirmed, isRejected,
        handleApprove, handleReject,
        iApproved,
        canAct,
    } = useEnhance(props);

    return (
        <div className="flex flex-col h-full gap-2">
            <Button variant="ghost" className="pl-0">
                <ArrowLeft onClick={toTheDashboard} className="text-muted-foreground" />
            </Button>

            <div className="flex gap-2">
                <div className="flex-1">
                    <Listing
                        listing={myListing}
                        isApproved={!!myApprovedAt}
                        isRejected={!!myRejectedAt}
                        color="var(--primary)"
                    />
                </div>
                <div className="flex-1">
                    <Listing
                        listing={counterpart}
                        isApproved={!!counterpartApprovedAt}
                        isRejected={!!counterpartRejectedAt}
                        color="var(--secondary)"
                    />
                </div>
            </div>

            <Contacts
                contact={isConfirmed && counterpartContact || undefined}
                iApproved={iApproved}
                isRejected={isRejected}
            />

            <div className="flex flex-1">
                <IntersectionMap primary={myListing} secondary={counterpart} />
            </div>

            {canAct && (
                <div className="flex flex-col gap-3">
                    <div>
                        <input
                            ref={inputRef}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                            placeholder="Your contact (phone, email, telegram…)"
                            value={contact}
                            onChange={onChangeContact}
                            disabled={!!loading}
                        />
                        <Button
                            variant="primary"
                            disabled={!!loading}
                            onClick={handleApprove}
                            loading={loading === 'approve'}
                            stretch
                        >
                            {loading === 'approve' ? 'Sending…' : 'Send contact'}
                        </Button>
                    </div>
                    <Button
                        variant="destructive"
                        disabled={!!loading}
                        onClick={handleReject}
                        loading={loading === 'reject'}
                        stretch
                    >
                        {loading === 'reject' ? 'Rejecting…' : 'Reject'}
                    </Button>
                </div>
            )}
        </div>
    )
}