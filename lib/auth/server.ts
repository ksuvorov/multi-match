import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { anonymous } from 'better-auth/plugins'
import { betterAuth } from 'better-auth'

import db from '@/lib/db'
import * as schema from './schema'

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,

    baseURL: {
        allowedHosts: [
            '*.vercel.app',
            'localhost:3000',
        ],
        protocol: 'auto',
        fallback: process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000',
    },

    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),

    account: {
        accountLinking: { enabled: true },
    },
    plugins: [anonymous()],
    emailAndPassword: { enabled: true },
})