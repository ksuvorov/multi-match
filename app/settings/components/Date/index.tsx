import { apiUrl } from '@/lib/api';

const Date = async () => {
    const res = await fetch(apiUrl('/api/date'), {
        next: { revalidate: 60 },
    });
    const data = await res.json()
    return (
        <div>
            {data.date}
        </div>
    )
}

export default Date;