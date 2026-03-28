'use client'

import dynamic from 'next/dynamic';

const Info = dynamic(() => import('./content'), {
    ssr: false,
    loading: () => <p>Info Loading...</p>,
});

const UserInfoWrapper = () => <Info />;

export default UserInfoWrapper;