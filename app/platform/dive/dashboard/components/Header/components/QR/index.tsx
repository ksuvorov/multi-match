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
                variant="secondary"
                size="icon"
                onClick={showQR}
                title="Share QR"
                className="rounded-lg"
            >
                <QrCode className="w-4 h-4" />
            </Button>
            {isPopupVisible && <Modal onClose={hideQR} />}
        </div>
    )
}