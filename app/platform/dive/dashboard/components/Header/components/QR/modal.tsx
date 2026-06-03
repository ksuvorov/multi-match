import { LoaderCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState } from 'react';

type Props = {
    onClose: () => void;
}
export default function Modal({onClose}: Props) {
    const [loaded, setLoaded] = useState(false);

    const url = `${window.location.origin}/platform/dive`
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}`

    return (
        createPortal(
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {!loaded && (
                        <div className="w-[256px] h-[256px] flex items-center justify-center">
                            <LoaderCircle className="animate-spin text-muted-foreground" />
                        </div>
                    )}
                    <img
                        src={qrSrc}
                        width={256}
                        height={256}
                        alt="QR Code"
                        className={loaded ? 'block' : 'hidden'}
                        onLoad={() => setLoaded(true)}
                    />
                </div>
            </div>,
            document.body
        )
    )
}