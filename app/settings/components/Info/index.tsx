'use client'

import { useState } from 'react'

const UserInfo = () => {
    const [telegramUser] = useState(() => {
        if (typeof window === 'undefined') return null
        const tg = window.Telegram?.WebApp
        tg?.ready()
        return tg?.initDataUnsafe?.user ?? null
    })

    return (
        <div>
            <h2>Из Telegram WebApp v2:</h2>
            <pre>{JSON.stringify(telegramUser, null, 2)}</pre>
        </div>
    )
}

export default UserInfo;