type Props = {
    contact?:    string
    iApproved?:  boolean
    isRejected?: boolean
}

export default function Contacts({ contact, iApproved, isRejected }: Props) {
    const className = `
        flex items-center justify-center text-center
        border p-4 rounded-lg
        ${contact    ? 'border-solid border-border-strong' : 'border-dashed border-border'}
        ${contact    ? 'bg-success-muted'                  : 'bg-white/[0.02]'}
        ${isRejected ? 'border-danger/20 bg-danger-muted'  : ''}
    `
    return (
        <div className={className}>
            {contact ? (
                <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-fg-muted">
                        Counterpart contact
                    </span>
                    <span className="font-sans text-lg font-bold text-brand">
                        {contact}
                      </span>
                </div>
            ) : isRejected ? (
                <span className="font-mono text-xs text-fg-muted">
                  This match was rejected.
                </span>
            ) : iApproved ? (
                <span className="font-mono text-xs text-fg-muted">
                  Waiting for counterpart to send contact
                </span>
            ) : (
                <span className="font-mono text-xs text-fg-muted">
                  Contact details will be revealed once both&nbsp;parties confirm.
                </span>
            )}
        </div>
    )
}