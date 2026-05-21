import { notFound } from 'next/navigation'

const coins = {
  btc: { symbol: 'BTCUSDT', name: 'Bitcoin' },
  eth: { symbol: 'ETHUSDT', name: 'Ethereum' },
  sol: { symbol: 'SOLUSDT', name: 'Solana' },
  bnb: { symbol: 'BNBUSDT', name: 'BNB' },
  xrp: { symbol: 'XRPUSDT', name: 'XRP' },
  doge: { symbol: 'DOGEUSDT', name: 'Dogecoin' }
}

async function getTicker(symbol) {
  const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { next: { revalidate: 30 } })
  if (!res.ok) throw new Error('ticker failed')
  return res.json()
}

async function getKlines(symbol) {
  const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=30`, { next: { revalidate: 30 } })
  if (!res.ok) throw new Error('klines failed')
  return res.json()
}

function sentiment(change) {
  if (change > 2) return ['bullish', 'Momentum kuat. Buyer masih dominan, tapi tetap cek area support sebelum entry.']
  if (change < -2) return ['bearish', 'Tekanan jual tinggi. Tunggu stabilisasi volume sebelum ambil keputusan.']
  return ['neutral', 'Market relatif netral. Cocok masuk watchlist sambil tunggu breakout atau breakdown.']
}

function spark(values, w=900, h=260) {
  if (!values.length) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const gap = values.length > 1 ? w / (values.length - 1) : w
  return values.map((v,i)=>`${i===0?'M':'L'}${(i*gap).toFixed(1)},${(h-((v-min)/(max-min||1))*h).toFixed(1)}`).join(' ')
}

export default async function CoinPage({ params }) {
  const coin = coins[params.symbol]
  if (!coin) notFound()
  const [ticker, klines] = await Promise.all([getTicker(coin.symbol), getKlines(coin.symbol)])
  const price = Number(ticker.lastPrice)
  const change = Number(ticker.priceChangePercent)
  const [tone, summary] = sentiment(change)
  const risk = Math.round(Math.min(95, 45 + Math.abs(change) * 4))
  const closes = klines.map(k => Number(k[4]))
  const d = spark(closes)
  return <main className="page"><section className="wrap">
    <nav className="nav glass"><div className="brand"><div className="brand-icon">AI</div><div><h1>{coin.name} Research</h1><p>{coin.symbol}</p></div></div><a className="btn" href="/">Dashboard</a></nav>
    <div className="hero"><div className="hero-main glass"><div className={`badge ${tone}`}>{tone}</div><h2>{coin.name} market read</h2><p>{summary}</p><p className="muted">30D chart</p><svg viewBox="0 0 900 260" width="100%" height="260"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity=".45"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></linearGradient></defs><path d={`${d} L900,260 L0,260 Z`} fill="url(#g)"/><path d={d} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/></svg></div><div className="hero-side glass"><p className="muted">Live Price</p><h2>${price.toLocaleString('en-US',{maximumFractionDigits: price < 1 ? 4 : 2})}</h2><p className={change >= 0 ? 'green' : 'red'}>{change.toFixed(2)}% 24h</p><p className="muted">High {Number(ticker.highPrice).toLocaleString()} / Low {Number(ticker.lowPrice).toLocaleString()}</p><p className="muted">Volume {Math.round(Number(ticker.volume)).toLocaleString()}</p></div></div>
    <div className="grid-bottom"><div className="card glass"><h3>Risk Score</h3><div className="score-ring" style={{'--score':`${risk}%`}}><strong>{risk}</strong></div><p className="small">Skor dihitung dari volatilitas 24h. Semakin tinggi, semakin perlu hati-hati.</p></div><div className="card glass"><h3>AI-style Research Summary</h3><p className="small">{coin.name} sedang berada dalam kondisi {tone}. Harga 24h bergerak {change.toFixed(2)}%. Untuk entry, cek konfirmasi volume, news terbaru, dan trend 30D chart. Gunakan ini sebagai watchlist signal, bukan financial advice.</p></div></div>
  </section></main>
}
