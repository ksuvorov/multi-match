type Props = {
    contact?: string
    iApproved?: boolean
    isRejected?: boolean
}
export default function Contacts({ contact, iApproved, isRejected }: Props) {
    const className = `
        flex items-center justify-center text-center border-2 p-4 rounded-lg text-sm text-muted-foreground
        ${contact ? 'border-solid' : 'border-dashed'}
    `
    return (
        <div className={className}>
            {contact ? (
                <div>
                    <div>Counterpart contact</div>
                    <div className="text-2xl text-foreground font-semibold">{contact}</div>
                </div>
            ) : isRejected ? (
                <div>This match was rejected.</div>
            ) : iApproved ? (
                <div>Waiting for counterpart to send contact</div>
            ) : (
                <div>Contact details will be revealed once both&nbsp;parties confirm.</div>
            )}
        </div>
    )
}