
import { readDb, writeDb, userIdFromReq } from '@/lib/db'

export async function GET(req) {
  const userId = userIdFromReq(req)
  const db = await readDb()
  const user = db.users[userId] || { username: userId, watchlist: [] }
  return Response.json({ ok: true, userId, watchlist: user.watchlist || [] })
}

export async function POST(req) {
  const userId = userIdFromReq(req)
  const { symbol } = await req.json().catch(() => ({}))
  if (!symbol) return Response.json({ ok: false, error: 'symbol required' }, { status: 400 })
  const db = await readDb()
  db.users[userId] ||= { username: userId, watchlist: [] }
  const list = new Set(db.users[userId].watchlist || [])
  if (list.has(symbol)) list.delete(symbol)
  else list.add(symbol)
  db.users[userId].watchlist = [...list]
  await writeDb(db)
  return Response.json({ ok: true, watchlist: db.users[userId].watchlist })
}
