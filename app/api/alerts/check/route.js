
import { readDb, writeDb } from '@/lib/db'

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return { ok: false, skipped: true }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
  })
  return res.json()
}

export async function POST(req) {
  const { sentimentScore } = await req.json().catch(() => ({}))
  const score = Number(sentimentScore)
  if (Number.isNaN(score)) return Response.json({ ok: false, error: 'sentimentScore required' }, { status: 400 })
  const db = await readDb()
  db.alerts ||= {}
  const prev = db.alerts.globalSentiment
  let changed = false
  let message = ''
  if (typeof prev === 'number' && Math.abs(score - prev) >= 20) {
    changed = true
    message = `CryptoIntel AI alert: sentiment changed from ${prev}% to ${score}%`
    await sendTelegram(message)
  }
  db.alerts.globalSentiment = score
  db.alerts.lastChecked = new Date().toISOString()
  await writeDb(db)
  return Response.json({ ok: true, changed, previous: prev ?? null, current: score, message })
}
