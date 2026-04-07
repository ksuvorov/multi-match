import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth/server'

export async function withSession(
    request: NextRequest,
    next: () => Promise<NextResponse>
) {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
        const anonResponse = await fetch(
            new URL("/api/auth/sign-in/anonymous", request.url),
            { method: "POST", headers: request.headers }
        )

        const response = await next()

        anonResponse.headers.getSetCookie().forEach((cookie) => {
            response.headers.append("Set-Cookie", cookie)
        })

        return response
    }

    return next()
}