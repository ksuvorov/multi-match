import Link from 'next/link';

import Button from '@/app/components/button';

import styles from './index.module.scss';

export default function DiveLanding() {
    return (
        <div className={styles.root}>
            <p className={styles.title}>Let’s get started</p>
            <p className={styles.subtitle}>What brings you here?</p>
            <div className={styles.buttons}>
                <Link href="/platform/dive/provide" className={styles.button}>
                    <Button title="I’m a diver" subtitle="Looking for my next dive" className={styles.button} />
                </Link>
                <Link href="/platform/dive/seek" className={styles.button}>
                    <Button title="I need a diver" subtitle="Got something to be done underwater" className={styles.button} />
                </Link>
            </div>
        </div>
    )
}