import { parseRss, sentimentStats } from '../../../lib/sentiment'

const feeds = [
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { name: 'Cointelegraph', url: 'https://cointelegraph.com/rss' },
  { name: 'Decrypt', url: 'https://decrypt.co/feed' },
]

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, { cache: 'no-store' })
    const text = await res.text()
    return parseRss(text, feed.name)
  } catch {
    return []
  }
}

export async function GET() {
  const items = (await Promise.all(feeds.map(fetchFeed))).flat().slice(0, 12)
  const stats = sentimentStats(items)
  return Response.json({ ok: true, stats, items })
}
