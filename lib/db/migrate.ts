import { migrate } from 'drizzle-orm/neon-http/migrator'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

await migrate(db, { migrationsFolder: './src/lib/db/migrations' })
console.log('migrations done')