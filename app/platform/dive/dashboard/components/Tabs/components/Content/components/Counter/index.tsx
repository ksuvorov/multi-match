type Props = {
    count: number,
}

export default function Counter({count}: Props) {
    return (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-semibold rounded-full bg-[#e5e5ea] text-[#8e8e93]">
            {count}
        </span>
    )
}