import {retrieveLaunchParams} from '@tma.js/sdk';

const UserInfo = () => {
    try {
        const { tgWebAppData: initData } = retrieveLaunchParams()
        const user = initData?.user

        return (
            <div>
                <h2>Из Telegram WebApp v5:</h2>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
        );
    } catch {
        return <p>Open in Telegram</p>
    }
}

export default UserInfo;