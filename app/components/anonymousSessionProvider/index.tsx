'use client'

import {useEffect, useRef} from 'react';

export default function AnonymousSessionProvider() {
    const started = useRef(false)

    useEffect(() => {
        if (started.current) return
        started.current = true

        const run = async () => {
            await fetch('/api/auth/sign-in/anonymous', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: '{}',
            })
        }

        run()
    }, [])

    return null
}