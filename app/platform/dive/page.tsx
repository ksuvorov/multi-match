import {headers} from 'next/headers';
import Link from 'next/link';

import {getPlatformBootstrap} from '@/lib/db/queries/bootstrap';
import Button from '@/app/components/button';

import styles from './index.module.scss';

const MAP: Record<string, { title: string; subtitle: string }> = {
    provider: {
        title: 'I’m a diver',
        subtitle: 'Looking for my next dive',
    },
    seeker: {
        title: 'I need a diver',
        subtitle: 'Got something to be done underwater',
    }
}

export default async function DiveLanding() {
    const h = await headers()
    const platformSlug = h.get('x-platform-slug')!
    const data = await getPlatformBootstrap(platformSlug)
    const roles = data?.platform.config.roles ?? []
    return (
        <div className={styles.root}>
            <p className={styles.title}>Let’s get started</p>
            <p className={styles.subtitle}>What brings you here?</p>
            <div className={styles.buttons}>
                {roles.map((role) => (
                    <Link key={role} href={`/platform/${platformSlug}/${role}`} className={styles.button}>
                        <Button title={MAP[role].title} subtitle={MAP[role].subtitle} className={styles.button} />
                    </Link>
                ))}
            </div>
        </div>
    )
}