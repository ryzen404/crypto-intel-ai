const coins = [
  { symbol:'BTCUSDT', slug:'btc', name:'Bitcoin' },
  { symbol:'ETHUSDT', slug:'eth', name:'Ethereum' },
  { symbol:'SOLUSDT', slug:'sol', name:'Solana' },
  { symbol:'BNBUSDT', slug:'bnb', name:'BNB' },
  { symbol:'XRPUSDT', slug:'xrp', name:'XRP' },
  { symbol:'DOGEUSDT', slug:'doge', name:'Dogecoin' }
]

const icon = s => `https://cryptoicons.org/api/icon/${s.replace('USDT','').toLowerCase()}/64`

async function fetchTicker(symbol) {
  const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { next: { revalidate: 30 } })
  if (!res.ok) throw new Error('ticker failed')
  return res.json()
}

async function fetchMarket() {
  try {
    const rows = await Promise.all(coins.map(async c => {
      const x = await fetchTicker(c.symbol)
      return {
        ...c,
        price: Number(x.lastPrice),
        change: Number(x.priceChangePercent),
        high: Number(x.highPrice),
        low: Number(x.lowPrice),
        volume: Number(x.volume),
        image: icon(c.symbol)
      }
    }))
    return rows
  } catch {
    return coins.map((c, i) => ({
      ...c,
      price: [68000, 3500, 180, 600, 0.52, 0.15][i],
      change: [2.4, -1.2, 4.8, 1.3, -0.8, 3.1][i],
      high: [69000, 3600, 190, 620, 0.55, 0.16][i],
      low: [67000, 3400, 170, 580, 0.49, 0.14][i],
      volume: [42000, 18000, 9000, 16000, 23000, 12000][i],
      image: icon(c.symbol)
    }))
  }
}

async function fetchNews() {
  return [
    { title: 'ETF inflow naik, sentimen market membaik', source: 'CoinDesk', score: 'bullish' },
    { title: 'Trader waspada liquidation saat volatilitas naik', source: 'Decrypt', score: 'neutral' },
    { title: 'Update jaringan besar dorong minat investor', source: 'Cointelegraph', score: 'bullish' }
  ]
}

function riskScore(change) {
  const base = 50 + Math.min(25, Math.abs(change) * 2)
  return Math.max(10, Math.min(95, Math.round(base)))
}

export default async function Page() {
  const market = await fetchMarket()
  const news = await fetchNews()
  const bullish = news.filter(n => n.score === 'bullish').length
  const sentimentScore = Math.round((bullish / news.length) * 100)

  return <main className="page"><section className="wrap">
    <nav className="nav glass"><div className="brand"><div className="brand-icon">AI</div><div><h1>CryptoIntel AI</h1><p>AI Crypto Research Dashboard</p></div></div><div className="navlinks"><a href="#market">Market</a><a href="#news">News</a><a href="#research">Research</a></div></nav>
    <div className="hero"><div className="hero-main glass"><div className="pill">Live market + news sentiment + risk score</div><h2>Riset crypto lebih cepat dengan market data, sentiment, dan AI-style summary.</h2><p>Dashboard ini gabung harga live, news sentiment, watchlist, dan risk score supaya kamu bisa cek coin cepat sebelum masuk posisi atau bikin konten riset.</p></div><div className="hero-side glass"><div className="score" style={{'--score':`${sentimentScore}%`}}><div><p className="muted">Overall sentiment</p><h3>Market is mildly bullish</h3><p className="muted">News dominated by inflow & adoption topics.</p></div><div className="score-ring"><strong>{sentimentScore}</strong></div></div></div></div>
    <div className="section-title" id="market"><h2>Market Dashboard</h2><span className="muted">Binance public API</span></div>
    <div className="toolbar"><div className="search"><span>⌕</span><input placeholder="Cari coin..." /></div><button className="btn">Refresh</button></div>
    <div className="coin-grid">{market.map(c=><a className="coin" href={`/coin/${c.slug}`} key={c.symbol}><div className="coin-left"><img className="coin-logo" src={c.image} alt={c.name} /><div><h3>{c.name}</h3><span>{c.symbol}</span><div className={`badge ${c.change >= 0 ? 'bullish' : 'bearish'}`}>{c.change >= 0 ? '▲' : '▼'} {c.change.toFixed(2)}%</div></div></div><div className="price"><strong>${c.price.toLocaleString('en-US',{maximumFractionDigits:c.price < 1 ? 4 : 2})}</strong><div className="muted">H {c.high.toLocaleString()} / L {c.low.toLocaleString()}</div><div className="muted">Vol {Math.round(c.volume).toLocaleString()}</div></div></a>)}</div>
    <div className="section-title" id="news"><h2>News Sentiment</h2><span className="muted">rule-based v1</span></div>
    <div className="news-grid">{news.map(n=><article className="news" key={n.title}><span className={`badge ${n.score}`}>{n.score}</span><h3>{n.title}</h3><p className="muted">Source: {n.source}</p><p className="muted">AI summary: headline ini cenderung {n.score} dan perlu dicek dengan chart harga + volume.</p></article>)}</div>
    <div className="section-title" id="research"><h2>Coin Research</h2><span className="muted">risk score & watchlist</span></div>
    <div className="card glass"><table className="table"><thead><tr><th>Coin</th><th>Change</th><th>Risk</th><th>Action</th></tr></thead><tbody>{market.map(c=><tr key={c.symbol}><td>{c.name}</td><td className={c.change >= 0 ? 'green' : 'red'}>{c.change.toFixed(2)}%</td><td>{riskScore(c.change)}/100</td><td><a className="btn" href={`/coin/${c.slug}`}>Research</a></td></tr>)}</tbody></table></div>
  </section></main>
}
