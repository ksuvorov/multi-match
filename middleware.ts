import { withPlatform } from '@/middlewares/withPlatform'
import { withSession } from '@/middlewares/withSession'
import { chain } from '@/middlewares'

export default chain(
    withSession,
    withPlatform,
)