const coins = {
  btc: { symbol:'BTCUSDT', name:'Bitcoin' },
  eth: { symbol:'ETHUSDT', name:'Ethereum' },
  sol: { symbol:'SOLUSDT', name:'Solana' },
  bnb: { symbol:'BNBUSDT', name:'BNB' },
  xrp: { symbol:'XRPUSDT', name:'XRP' },
  doge: { symbol:'DOGEUSDT', name:'Dogecoin' }
}

async function getTicker(symbol) {
  const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { next: { revalidate: 30 } })
  if (!res.ok) throw new Error('ticker failed')
  return res.json()
}

function sentiment(change) {
  if (change > 2) return ['bullish', 'Momentum kuat. Buyer masih dominan, tapi tetap cek area support sebelum entry.']
  if (change < -2) return ['bearish', 'Tekanan jual tinggi. Tunggu stabilisasi volume sebelum ambil keputusan.']
  return ['neutral', 'Market relatif netral. Cocok masuk watchlist sambil tunggu breakout atau breakdown.']
}

export default async function CoinPage({ params }) {
  const coin = coins[params.symbol]
  if (!coin) return <main className="page"><section className="wrap"><div className="card glass"><h1>Coin not found</h1><a className="btn" href="/">Back</a></div></section></main>
  const x = await getTicker(coin.symbol)
  const price = Number(x.lastPrice)
  const change = Number(x.priceChangePercent)
  const [tone, summary] = sentiment(change)
  const risk = Math.round(Math.min(95, 45 + Math.abs(change) * 4))
  return <main className="page"><section className="wrap">
    <nav className="nav glass"><div className="brand"><div className="brand-icon">AI</div><div><h1>{coin.name} Research</h1><p>{coin.symbol}</p></div></div><a className="btn" href="/">Dashboard</a></nav>
    <div className="hero"><div className="hero-main glass"><div className={`badge ${tone}`}>{tone}</div><h2>{coin.name} market read</h2><p>{summary}</p></div><div className="hero-side glass"><p className="muted">Live Price</p><h2>${price.toLocaleString('en-US',{maximumFractionDigits: price < 1 ? 4 : 2})}</h2><p className={change >= 0 ? 'green' : 'red'}>{change.toFixed(2)}% 24h</p></div></div>
    <div className="grid-bottom"><div className="card glass"><h3>Risk Score</h3><div className="score-ring" style={{'--score':`${risk}%`}}><strong>{risk}</strong></div><p className="small">Skor dihitung dari volatilitas 24h. Semakin tinggi, semakin perlu hati-hati.</p></div><div className="card glass"><h3>AI-style Research Summary</h3><p className="small">{coin.name} sedang berada dalam kondisi {tone}. Harga 24h bergerak {change.toFixed(2)}%. Untuk entry, cek konfirmasi volume dan news terbaru. Gunakan ini sebagai watchlist signal, bukan financial advice.</p></div></div>
  </section></main>
}
