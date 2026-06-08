'use client'

import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

import Button from '@/app/components/Button';

import MapSkeleton from './components/IntersectionMap/skeleton'
import Contacts from './components/Contacts';
import Listing from './components/Listing';

import { useEnhance } from './hooks';
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
        <div className="flex flex-col h-full">
            <Button
                variant="ghost"
                size="icon"
                onClick={toTheDashboard}
                className="rounded-full backdrop-blur-md border border-border absolute z-1 top-4 left-4"
                style={{ background: 'color-mix(in srgb, var(--surface) 75%, transparent)' }}
                aria-label="Back"
            >
                <ArrowLeft className="w-4 h-4 text-brand stroke-[2.5]" />
            </Button>

            <div className="flex flex-1 z-0">
                <IntersectionMap primary={myListing} secondary={counterpart} />
            </div>

            <div className="flex flex-col gap-2 -mt-[36px] z-1 bg-page p-4 rounded-t-lg">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Listing
                            listing={myListing}
                            isApproved={!!myApprovedAt}
                            isRejected={!!myRejectedAt}
                            color="var(--brand)"
                        />
                    </div>
                    <div className="flex-1">
                        <Listing
                            listing={counterpart}
                            isApproved={!!counterpartApprovedAt}
                            isRejected={!!counterpartRejectedAt}
                            color="var(--info)"
                        />
                    </div>
                </div>

                <Contacts
                    contact={isConfirmed && counterpartContact || undefined}
                    iApproved={iApproved}
                    isRejected={isRejected}
                />

                {canAct && (
                    <div className="flex flex-col gap-2">
                        <input
                            ref={inputRef}
                            className="
                            w-full px-3.5 py-3 rounded-lg
                            bg-input border border-border
                            font-sans text-sm text-fg placeholder:text-fg-muted
                            outline-none focus:border-border-strong
                            disabled:opacity-50
                            transition-colors
                        "
                            placeholder="Your contact (phone, email, telegram…)"
                            value={contact}
                            onChange={onChangeContact}
                            disabled={!!loading}
                        />

                        <Button
                            variant="primary"
                            size="lg"
                            stretch
                            disabled={!!loading}
                            loading={loading === 'approve'}
                            onClick={handleApprove}
                        >
                            {loading === 'approve' ? 'Sending…' : 'Send contact'}
                        </Button>

                        <Button
                            variant="destructive"
                            size="lg"
                            stretch
                            disabled={!!loading}
                            loading={loading === 'reject'}
                            onClick={handleReject}
                        >
                            {loading === 'reject' ? 'Rejecting…' : 'Reject'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}