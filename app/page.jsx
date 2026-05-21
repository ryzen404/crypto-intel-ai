'use client'

import { useEffect, useMemo, useState } from 'react'

const coins = [
  { symbol:'BTCUSDT', slug:'btc', name:'Bitcoin' },
  { symbol:'ETHUSDT', slug:'eth', name:'Ethereum' },
  { symbol:'SOLUSDT', slug:'sol', name:'Solana' },
  { symbol:'BNBUSDT', slug:'bnb', name:'BNB' },
  { symbol:'XRPUSDT', slug:'xrp', name:'XRP' },
  { symbol:'DOGEUSDT', slug:'doge', name:'Dogecoin' }
]

const icon = s => `https://cryptoicons.org/api/icon/${s.replace('USDT','').toLowerCase()}/64`

export default function Page() {
  const [market, setMarket] = useState([])
  const [news, setNews] = useState([])
  const [query, setQuery] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const [summary, setSummary] = useState('AI summary akan muncul di sini setelah coin dipilih.')
  const [sentimentScore, setSentimentScore] = useState(72)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('watchlist') || '[]')
    setWatchlist(saved)
  }, [])

  useEffect(() => { localStorage.setItem('watchlist', JSON.stringify(watchlist)) }, [watchlist])

  async function loadData() {
    const [marketRes, newsRes] = await Promise.all([fetch('/api/market'), fetch('/api/rss')])
    const marketJson = await marketRes.json()
    const newsJson = await newsRes.json()
    setMarket(marketJson.market || [])
    setNews(newsJson.items || [])
    const bullish = (newsJson.items || []).filter(n => n.score === 'bullish').length
    setSentimentScore(Math.round(((bullish || 1) / Math.max(1, (newsJson.items || []).length)) * 100))
  }

  async function research(coin) {
    const res = await fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coin, market: market.find(m => m.symbol === coin.symbol), news })
    })
    const json = await res.json()
    setSummary(json.summary || 'No summary returned.')
  }

  useEffect(() => { loadData() }, [])

  const filtered = useMemo(() => market.filter(c => `${c.name} ${c.symbol}`.toLowerCase().includes(query.toLowerCase())), [market, query])

  return <main className="page"><section className="wrap">
    <nav className="nav glass"><div className="brand"><div className="brand-icon">AI</div><div><h1>CryptoIntel AI</h1><p>AI Crypto Research Dashboard</p></div></div><div className="navlinks"><a href="#market">Market</a><a href="#news">News</a><a href="#research">Research</a></div></nav>
    <div className="hero"><div className="hero-main glass"><div className="pill">Live market + news sentiment + risk score</div><h2>Riset crypto lebih cepat dengan market data, sentiment, dan AI-style summary.</h2><p>Dashboard ini gabung harga live, news sentiment, watchlist, dan risk score supaya kamu bisa cek coin cepat sebelum masuk posisi atau bikin konten riset.</p></div><div className="hero-side glass"><div className="score" style={{'--score':`${sentimentScore}%`}}><div><p className="muted">Overall sentiment</p><h3>Market is mildly bullish</h3><p className="muted">News dominated by inflow & adoption topics.</p></div><div className="score-ring"><strong>{sentimentScore}</strong></div></div></div></div>
    <div className="section-title" id="market"><h2>Market Dashboard</h2><span className="muted">Binance public API</span></div>
    <div className="toolbar"><div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari coin..." /></div><button className="btn" onClick={loadData}>Refresh</button></div>
    <div className="coin-grid">{filtered.map(c=><div className="coin" key={c.symbol}><div className="coin-left"><img className="coin-logo" src={icon(c.symbol)} alt={c.name} /><div><h3>{c.name}</h3><span>{c.symbol}</span><div className={`badge ${c.change >= 0 ? 'bullish' : 'bearish'}`}>{c.change >= 0 ? '▲' : '▼'} {c.change.toFixed(2)}%</div></div></div><div className="price"><strong>${c.price.toLocaleString('en-US',{maximumFractionDigits:c.price < 1 ? 4 : 2})}</strong><div className="muted">H {c.high.toLocaleString()} / L {c.low.toLocaleString()}</div><div className="muted">Vol {Math.round(c.volume).toLocaleString()}</div><div style={{marginTop:'10px'}}><a className="btn" href={`/coin/${c.slug}`}>Research</a></div><button className="btn" style={{marginTop:'10px',background:'linear-gradient(135deg,#7c3aed,#06b6d4)'}} onClick={() => research(c)}>AI Summary</button></div></div>)}</div>
    <div className="section-title" id="news"><h2>News Sentiment</h2><span className="muted">RSS real</span></div>
    <div className="news-grid">{news.map(n=><article className="news" key={n.title}><span className={`badge ${n.score}`}>{n.score}</span><h3><a href={n.link} target="_blank" rel="noreferrer">{n.title}</a></h3><p className="muted">Source: {n.source}</p><p className="muted">AI summary: headline ini cenderung {n.score} dan perlu dicek dengan chart harga + volume.</p></article>)}</div>
    <div className="section-title" id="research"><h2>Watchlist & AI Summary</h2><span className="muted">localStorage + 9Router hook</span></div>
    <div className="grid-bottom"><div className="card glass"><h3>Watchlist</h3><div className="coin-grid">{market.map(c=><button key={c.symbol} className="btn" onClick={() => setWatchlist(w => w.includes(c.symbol) ? w.filter(x => x !== c.symbol) : [...w, c.symbol])}>{watchlist.includes(c.symbol) ? 'Remove ' : 'Add '}{c.name}</button>)}</div><p className="small">Saved in browser localStorage.</p></div><div className="card glass"><h3>AI Summary via 9Router</h3><p className="small">{summary}</p><div className="coin-grid" style={{marginTop:'16px'}}><a className="btn" href="https://t.me/your_bot" target="_blank" rel="noreferrer">Telegram Alert Hook</a><a className="btn" href="/coin/btc">Open Coin Detail</a></div></div></div>
  </section></main>
}
