import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { anonymous } from 'better-auth/plugins'
import { betterAuth } from 'better-auth'

import db from '@/lib/db'
import * as schema from './schema'

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,

    baseURL: {
        allowedHosts: [
            new URL(process.env.BETTER_AUTH_URL!).host,
            '*.vercel.app',
            'localhost:3000',
        ],
        protocol: 'auto',
        fallback: process.env.BETTER_AUTH_URL!,
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