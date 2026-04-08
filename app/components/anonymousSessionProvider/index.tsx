'use client'

import {useEffect, useRef} from 'react';

import {authClient} from '@/lib/auth/client';

export default function AnonymousSessionProvider() {
    const started = useRef(false)

    useEffect(() => {
        if (started.current) return
        started.current = true

        const run = async () => {
            const session = await authClient.getSession()
            if (!session.data) {
                await authClient.signIn.anonymous()
            }
        }

        run()
    }, [])

    return null
}