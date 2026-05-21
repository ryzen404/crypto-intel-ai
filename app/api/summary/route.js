export async function POST(req) {
  const { coin, market, news } = await req.json().catch(() => ({}))
  const key = process.env.NINE_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY || ''
  const model = process.env.NINE_ROUTER_MODEL || 'fr/gpt-5.5'
  const prompt = `Buat ringkasan riset crypto singkat dalam Bahasa Indonesia.
Coin: ${coin?.name || '-'} (${coin?.symbol || '-'})
Market: ${market ? JSON.stringify(market) : '-'}
News: ${news ? JSON.stringify(news) : '-'}
Format: 1 paragraf summary, 1 paragraf risk, 3 bullet insight.`
  if (!key) {
    return Response.json({ ok: true, summary: `${coin?.name || 'Coin'} sedang dipantau. Harga dan berita perlu dicek untuk konfirmasi trend.`, risk: 'Gunakan chart dan volume untuk validasi entry.' })
  }
  try {
    const res = await fetch('http://127.0.0.1:20128/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a crypto research assistant. Reply in Indonesian, concise.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    })
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || ''
    return Response.json({ ok: true, summary: text || 'No summary returned.' })
  } catch (e) {
    return Response.json({ ok: true, summary: `${coin?.name || 'Coin'} sedang dipantau. AI summary fallback aktif karena provider belum siap.` })
  }
}
