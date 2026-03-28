import { retrieveLaunchParams } from '@tma.js/sdk';

const UserInfo = () => {
    const debug = {
        href: window.location.href,
        telegram: !!window.Telegram?.WebApp,
        initData: window.Telegram?.WebApp?.initData,
        initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe,
    }

    let params = null
    let error = null

    try {
        params = retrieveLaunchParams()
    } catch (e) {
        error = String(e)
    }

    return (
        <pre style={{ fontSize: 10, wordBreak: 'break-all' }}>
            {JSON.stringify({ params, error, debug }, null, 2)}
        </pre>
    )
}

export default UserInfo;