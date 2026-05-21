export const bullishWords = ['surge','rally','gain','bullish','breakout','etf','adoption','partnership','inflow','upgrade','record','approve','launch','institutional','accumulate','soar','rise']
export const bearishWords = ['crash','drop','hack','exploit','lawsuit','ban','outflow','liquidation','bearish','selloff','fraud','delay','reject','plunge','fall','risk']

export function sentimentFor(text = '') {
  const t = text.toLowerCase()
  const bull = bullishWords.filter(w => t.includes(w)).length
  const bear = bearishWords.filter(w => t.includes(w)).length
  if (bull > bear) return 'bullish'
  if (bear > bull) return 'bearish'
  return 'neutral'
}

export function sentimentStats(items = []) {
  const total = Math.max(1, items.length)
  const counts = { bullish: 0, bearish: 0, neutral: 0 }
  for (const item of items) counts[item.sentiment || 'neutral']++
  return {
    bullish: Math.round((counts.bullish / total) * 100),
    bearish: Math.round((counts.bearish / total) * 100),
    neutral: Math.round((counts.neutral / total) * 100),
    counts
  }
}

export function stripXml(text = '') {
  return text.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
}

export function parseRss(xml = '', source = 'RSS') {
  const items = [...xml.matchAll(/<item[\s\S]*?<\/item>/g)].slice(0, 8)
  return items.map((m, i) => {
    const block = m[0]
    const title = stripXml((block.match(/<title[\s\S]*?>([\s\S]*?)<\/title>/) || [,''])[1])
    const link = stripXml((block.match(/<link[\s\S]*?>([\s\S]*?)<\/link>/) || [,''])[1])
    const pubDate = stripXml((block.match(/<pubDate[\s\S]*?>([\s\S]*?)<\/pubDate>/) || [,''])[1])
    const description = stripXml((block.match(/<description[\s\S]*?>([\s\S]*?)<\/description>/) || [,''])[1]).slice(0, 220)
    const sentiment = sentimentFor(`${title} ${description}`)
    return { id: `${source}-${i}`, title, link, pubDate, description, source, sentiment }
  }).filter(x => x.title)
}
