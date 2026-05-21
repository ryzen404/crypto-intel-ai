export async function GET() {
  const feeds = [
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'https://cointelegraph.com/rss',
    'https://decrypt.co/feed'
  ]
  const items = []
  for (const url of feeds) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      const xml = await res.text()
      const matches = [...xml.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>/g)]
      for (const m of matches.slice(0, 3)) {
        const title = m[1].replace(/<[^>]+>/g, '')
        const link = m[2].trim()
        const pubDate = m[3].trim()
        const score = /hack|crash|drop|exploit|liquidation/i.test(title) ? 'bearish' : /etf|adoption|partnership|inflow|upgrade|surge|rally/i.test(title) ? 'bullish' : 'neutral'
        items.push({ title, link, pubDate, source: new URL(url).hostname.replace('www.',''), score })
      }
    } catch {}
  }
  if (!items.length) {
    items.push(
      { title: 'ETF inflow naik, sentimen market membaik', link: '#', pubDate: '', source: 'fallback', score: 'bullish' },
      { title: 'Trader waspada liquidation saat volatilitas naik', link: '#', pubDate: '', source: 'fallback', score: 'neutral' },
      { title: 'Update jaringan besar dorong minat investor', link: '#', pubDate: '', source: 'fallback', score: 'bullish' }
    )
  }
  return Response.json({ ok: true, items })
}
