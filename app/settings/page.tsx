import Link from 'next/link';

import Date from './components/Date';
import Info from './components/Info';

export default async function Home() {
    return (
        <div>
            <Date />
            <Info />
            <Link href="/">Back</Link>
        </div>
    )
}