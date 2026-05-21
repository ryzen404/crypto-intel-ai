export async function GET() {
  const symbols = ['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT','DOGEUSDT']
  const names = { BTCUSDT:'Bitcoin', ETHUSDT:'Ethereum', SOLUSDT:'Solana', BNBUSDT:'BNB', XRPUSDT:'XRP', DOGEUSDT:'Dogecoin' }
  try {
    const rows = await Promise.all(symbols.map(async symbol => {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { cache: 'no-store' })
      const x = await res.json()
      return { symbol, name: names[symbol], price: Number(x.lastPrice), change: Number(x.priceChangePercent), high: Number(x.highPrice), low: Number(x.lowPrice), volume: Number(x.volume) }
    }))
    return Response.json({ ok: true, market: rows })
  } catch (e) {
    return Response.json({ ok: false, error: 'Failed to load market data' }, { status: 500 })
  }
}
