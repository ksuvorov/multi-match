import {unstable_cache} from 'next/cache';
import {sql} from 'drizzle-orm';

import { apiUrl } from '@/lib/api';
import db from '@/lib/db';

const getDbTime = unstable_cache(
    async () => {
        const result = await db.execute(sql`SELECT NOW() as current_time`)
        return result.rows[0].current_time
    },
    ['db-time'],
    { revalidate: 60 }
)

const Date = async () => {
    const edgeRes = await fetch(apiUrl('/api/date'), {
        next: { revalidate: 60 },
    });
    const edge = await edgeRes.json();
    const date_db = (await getDbTime()) as string;
    return (
        <div>
            <p>
                edge: {edge.date}
            </p>
            <p>
                db: {date_db}
            </p>
        </div>
    )
}

export default Date;