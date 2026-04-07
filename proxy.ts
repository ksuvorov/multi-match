import { withPlatform } from '@/middlewares/withPlatform'
import { chain } from '@/middlewares'

export default chain(
    withPlatform,
)

export const config = {
    matcher: [
        '/((?!api|_next|.*\\..*).*)',
    ],
}