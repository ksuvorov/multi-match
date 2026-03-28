import { retrieveLaunchParams } from '@tma.js/sdk';

const UserInfo = () => {
    const { tgWebAppData } = retrieveLaunchParams()
    const user = tgWebAppData?.user;

    return (
        <div>
            <h2>Из Telegram WebApp v6:</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
}

export default UserInfo;