import { createPortal } from 'react-dom';

type Props = {
    onClose: () => void;
}
export default function Modal({onClose}: Props) {
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
                    <img src={qrSrc} width={256} height={256} alt="QR Code" />
                </div>
            </div>,
            document.body
        )
    )
}