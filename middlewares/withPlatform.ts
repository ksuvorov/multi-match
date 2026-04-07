import { NextRequest, NextResponse } from 'next/server'

export async function withPlatform(
    request: NextRequest,
    next: () => Promise<NextResponse>
) {
    const segments = request.nextUrl.pathname.split('/');
    if (segments[1] !== 'platform') {
        return next();
    }

    const platformSlug = segments[2];

    const ignoredPrefixes = ['_next', 'favicon.ico', 'api', 'public']

    if (!platformSlug || ignoredPrefixes.includes(platformSlug)) {
        return next()
    }

    const validPlatforms = ['dive']
    if (!validPlatforms.includes(platformSlug)) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    const res = await next()
    res.headers.set('x-platform-slug', platformSlug)

    return res
}