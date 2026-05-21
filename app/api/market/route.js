const coins = [
  { symbol:'BTCUSDT', name:'Bitcoin' }, { symbol:'ETHUSDT', name:'Ethereum' }, { symbol:'SOLUSDT', name:'Solana' },
  { symbol:'BNBUSDT', name:'BNB' }, { symbol:'XRPUSDT', name:'XRP' }, { symbol:'DOGEUSDT', name:'Dogecoin' }
]
export async function GET() {
  try {
    const market = await Promise.all(coins.map(async c => {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${c.symbol}`, { cache: 'no-store' })
      const x = await res.json()
      return { ...c, price: Number(x.lastPrice), change: Number(x.priceChangePercent), high: Number(x.highPrice), low: Number(x.lowPrice), volume: Number(x.volume) }
    }))
    return Response.json({ ok: true, market })
  } catch {
    return Response.json({ ok: false, error: 'Failed to load market data' }, { status: 500 })
  }
}
