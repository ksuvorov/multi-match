import { anonymousClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { baseUrl } from '@/lib/baseUrl'

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : baseUrl,
    plugins: [anonymousClient()],
})