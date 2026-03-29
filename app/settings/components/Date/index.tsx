import { apiUrl } from '@/lib/api';

const Date = async () => {
    const edgeRes = await fetch(apiUrl('/api/date'), {
        next: { revalidate: 60 },
    });
    const edge = await edgeRes.json();
    const dbRes = await fetch(apiUrl('/api/date_db'), {
        next: { revalidate: 60 },
    });
    const db = await dbRes.json();
    return (
        <div>
            <p>
                edge: {edge.date}
            </p>
            <p>
                db: {db.date}
            </p>
        </div>
    )
}

export default Date;