const symbols = ['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT','DOGEUSDT']
const names = { BTCUSDT:'Bitcoin', ETHUSDT:'Ethereum', SOLUSDT:'Solana', BNBUSDT:'BNB', XRPUSDT:'XRP', DOGEUSDT:'Dogecoin' }
const fallback = {
  BTCUSDT:{ price:68000, change:2.4, high:69000, low:67000, volume:42000 },
  ETHUSDT:{ price:3500, change:-1.2, high:3600, low:3400, volume:18000 },
  SOLUSDT:{ price:180, change:4.8, high:190, low:170, volume:9000 },
  BNBUSDT:{ price:600, change:1.3, high:620, low:580, volume:16000 },
  XRPUSDT:{ price:0.52, change:-0.8, high:0.55, low:0.49, volume:23000 },
  DOGEUSDT:{ price:0.15, change:3.1, high:0.16, low:0.14, volume:12000 }
}
function num(v){ const n = Number(v); return Number.isFinite(n) ? n : null }
function row(symbol, x={}) {
  const f = fallback[symbol]
  return {
    symbol,
    slug: symbol.replace('USDT','').toLowerCase(),
    name: names[symbol],
    price: num(x.lastPrice) ?? f.price,
    change: num(x.priceChangePercent) ?? f.change,
    high: num(x.highPrice) ?? f.high,
    low: num(x.lowPrice) ?? f.low,
    volume: num(x.volume) ?? f.volume
  }
}

export async function GET() {
  const market = await Promise.all(symbols.map(async symbol => {
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { cache: 'no-store' })
      if (!res.ok) return row(symbol)
      const x = await res.json()
      return row(symbol, x)
    } catch {
      return row(symbol)
    }
  }))
  return Response.json({ ok: true, market })
}
