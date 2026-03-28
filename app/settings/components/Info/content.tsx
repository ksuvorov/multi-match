import { retrieveLaunchParams } from '@tma.js/sdk';

const UserInfo = () => {
    let user = null

    try {
        const { tgWebAppData } = retrieveLaunchParams()
        user = tgWebAppData?.user ?? null
    } catch {
        // Not in TG
    }

    if (!user) return <p>Open in Telegram</p>

    return (
        <div>
            <h2>Из Telegram WebApp v7:</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}

export default UserInfo;