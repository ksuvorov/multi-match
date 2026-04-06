import { migrate } from 'drizzle-orm/neon-http/migrator'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

async function main() {
    const sql = neon(process.env.DATABASE_URL!)
    const db = drizzle(sql)

    await migrate(db, {
        migrationsFolder: './lib/db/migrations',
        migrationsTable: 'migrations',
        migrationsSchema: 'public',
    })
    console.log('migrations done')
}

main().catch(console.error)