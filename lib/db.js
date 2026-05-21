
import { promises as fs } from 'fs'
import path from 'path'

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'crypto-intel-db.json')

async function ensureDb() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  try { await fs.access(DB_PATH) } catch { await fs.writeFile(DB_PATH, JSON.stringify({ users: {}, alerts: {} }, null, 2)) }
}

export async function readDb() {
  await ensureDb()
  return JSON.parse(await fs.readFile(DB_PATH, 'utf8'))
}

export async function writeDb(db) {
  await ensureDb()
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

export function userIdFromReq(req) {
  return req.headers.get('x-user-id') || 'demo-user'
}
