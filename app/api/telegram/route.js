export async function POST(req) {
  const { message } = await req.json().catch(() => ({}))
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return Response.json({ ok: false, error: 'Telegram env not configured' }, { status: 400 })
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message || 'CryptoIntel AI alert', parse_mode: 'HTML' })
    })
    const data = await res.json()
    return Response.json({ ok: data.ok, data })
  } catch (e) {
    return Response.json({ ok: false, error: 'Telegram send failed' }, { status: 500 })
  }
}
