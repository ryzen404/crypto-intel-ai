
import { readDb, writeDb } from '@/lib/db'

export async function POST(req) {
  const { username } = await req.json().catch(() => ({}))
  const id = (username || 'demo-user').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32) || 'demo-user'
  const db = await readDb()
  db.users[id] ||= { username: id, watchlist: [] }
  await writeDb(db)
  return Response.json({ ok: true, user: { id, username: db.users[id].username } })
}
