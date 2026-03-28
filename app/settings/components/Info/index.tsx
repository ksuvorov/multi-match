'use client'

import { useEffect } from 'react'

const UserInfo = () => {
    const tg = typeof window !== 'undefined'
        ? window.Telegram?.WebApp
        : null

    const telegramUser = tg?.initDataUnsafe?.user ?? null

    useEffect(() => {
        tg?.ready()
    }, [tg]);

    return (
        <div>
            <h2>Из Telegram WebApp:</h2>
            <pre>{JSON.stringify(telegramUser, null, 2)}</pre>
        </div>
    )
}

export default UserInfo;