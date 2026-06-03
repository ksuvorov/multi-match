import { LoaderCircle } from 'lucide-react';

export default function Skeleton() {
    return (
        <div className="border-2 border-solid rounded-lg flex items-center justify-center flex-1">
            <LoaderCircle className="animate-spin text-muted-foreground" />
        </div>
    )
}