import { NextRequest, NextResponse } from 'next/server';

type MiddlewareFn = (
    request: NextRequest,
    next: () => Promise<NextResponse>
) => Promise<NextResponse>

export function chain(...fns: MiddlewareFn[]) {
    return async (request: NextRequest): Promise<NextResponse> => {
        const run = async (i: number): Promise<NextResponse> => {
            if (i >= fns.length) return NextResponse.next()
            return fns[i](request, () => run(i + 1))
        }
        return run(0)
    }
}