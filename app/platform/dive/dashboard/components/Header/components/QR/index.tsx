'use client'

import { useCallback, useState } from 'react';
import { QrCode } from 'lucide-react';
import dynamic from 'next/dynamic';

import Button from '@/app/components/Button';

const Modal = dynamic(() => import('./modal'), {
    ssr: false,
})

export default function QR() {
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const showQR = useCallback(() => setIsPopupVisible(true), []);
    const hideQR = useCallback(() => setIsPopupVisible(false), []);

    return (
        <div className="flex gap-2">
            <Button
                onClick={showQR}
                className="text-xl leading-none"
                title="Share QR"
                variant="secondary"
            >
                <QrCode />
            </Button>
            {isPopupVisible && <Modal onClose={hideQR} />}
        </div>
    )
}