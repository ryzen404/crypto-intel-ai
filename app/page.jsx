'use client'

import { useEffect, useMemo, useState } from 'react'

const icon = s => `https://cryptoicons.org/api/icon/${s.replace('USDT','').toLowerCase()}/64`
const riskScore = change => Math.round(Math.min(95, 45 + Math.abs(change) * 4))

export default function Page() {
  const [market, setMarket] = useState([])
  const [news, setNews] = useState([])
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('change')
  const [filter, setFilter] = useState('all')
  const [watchlist, setWatchlist] = useState([])
  const [summary, setSummary] = useState('AI summary akan muncul di sini setelah coin dipilih.')
  const [sentimentScore, setSentimentScore] = useState(72)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('rizal')
  const [alertStatus, setAlertStatus] = useState('Belum dicek')

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('cryptoIntelUser') || 'null')
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
    if (savedUser) setUser(savedUser)
    setWatchlist(savedWatchlist)
    loadData()
  }, [])

  useEffect(() => { localStorage.setItem('watchlist', JSON.stringify(watchlist)) }, [watchlist])

  async function login() {
    const res = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username }) })
    const json = await res.json()
    if (json.user) {
      setUser(json.user)
      localStorage.setItem('cryptoIntelUser', JSON.stringify(json.user))
      const wl = await fetch('/api/watchlist', { headers:{'x-user-id':json.user.id} }).then(r=>r.json())
      setWatchlist(wl.watchlist || [])
    }
  }

  async function loadData() {
    const [marketRes, newsRes] = await Promise.all([fetch('/api/market'), fetch('/api/rss')])
    const marketJson = await marketRes.json()
    const newsJson = await newsRes.json()
    setMarket(marketJson.market || [])
    setNews(newsJson.items || [])
    const bullish = (newsJson.items || []).filter(n => n.score === 'bullish').length
    const score = Math.round(((bullish || 1) / Math.max(1, (newsJson.items || []).length)) * 100)
    setSentimentScore(score)
  }

  async function toggleWatch(symbol) {
    if (user) {
      const res = await fetch('/api/watchlist', { method:'POST', headers:{'Content-Type':'application/json','x-user-id':user.id}, body:JSON.stringify({ symbol }) })
      const json = await res.json()
      setWatchlist(json.watchlist || [])
      return
    }
    setWatchlist(w => w.includes(symbol) ? w.filter(x => x !== symbol) : [...w, symbol])
  }

  async function research(coin) {
    const res = await fetch('/api/summary', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coin, market: market.find(m => m.symbol === coin.symbol), news })
    })
    const json = await res.json()
    setSummary(json.summary || 'No summary returned.')
  }

  async function checkAlert() {
    const res = await fetch('/api/alerts/check', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ sentimentScore }) })
    const json = await res.json()
    setAlertStatus(json.changed ? json.message : `No big change. Current ${json.current}%`)
  }

  const filtered = useMemo(() => {
    let rows = market.filter(c => `${c.name} ${c.symbol}`.toLowerCase().includes(query.toLowerCase()))
    if (filter === 'gainers') rows = rows.filter(c => c.change >= 0)
    if (filter === 'losers') rows = rows.filter(c => c.change < 0)
    if (filter === 'watchlist') rows = rows.filter(c => watchlist.includes(c.symbol))
    rows = [...rows].sort((a,b) => sort === 'price' ? b.price-a.price : sort === 'volume' ? b.volume-a.volume : b.change-a.change)
    return rows
  }, [market, query, sort, filter, watchlist])

  return <main className="page"><section className="wrap">
    <nav className="nav glass"><div className="brand"><div className="brand-icon">AI</div><div><h1>CryptoIntel AI</h1><p>AI Crypto Research Dashboard</p></div></div><div className="navlinks"><a href="#market">Market</a><a href="#news">News</a><a href="#research">Research</a><a href="/compare">Compare</a></div></nav>
    <div className="hero"><div className="hero-main glass"><div className="pill">Live market + RSS sentiment + database watchlist</div><h2>Crypto research terminal dengan news sentiment, alert, dan compare page.</h2><p>Filter market cepat, simpan watchlist, buka chart detail, baca RSS sentiment, dan trigger AI summary lewat 9Router.</p><div className="stat-row"><div><b>{market.length}</b><span> coins</span></div><div><b>{news.length}</b><span> headlines</span></div><div><b>{watchlist.length}</b><span> watchlist</span></div></div></div><div className="hero-side glass"><div className="score" style={{'--score':`${sentimentScore}%`}}><div><p className="muted">Overall sentiment</p><h3>{sentimentScore >= 60 ? 'Market bullish' : sentimentScore <= 40 ? 'Market bearish' : 'Market neutral'}</h3><p className="muted">Auto alert aktif kalau sentiment berubah besar.</p><button className="btn" onClick={checkAlert}>Check Alert</button><p className="small">{alertStatus}</p></div><div className="score-ring"><strong>{sentimentScore}</strong></div></div></div></div>
    <div className="section-title" id="market"><h2>Market Dashboard</h2><span className="muted">Search + filter + sort</span></div>
    <div className="toolbar pro"><div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari coin atau symbol..." /></div><select className="input" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All</option><option value="gainers">Gainers</option><option value="losers">Losers</option><option value="watchlist">Watchlist</option></select><select className="input" value={sort} onChange={e=>setSort(e.target.value)}><option value="change">Sort change</option><option value="price">Sort price</option><option value="volume">Sort volume</option></select><button className="btn" onClick={loadData}>Refresh</button></div>
    <div className="coin-grid">{filtered.map(c=><div className="coin shine" key={c.symbol}><div className="coin-left"><img className="coin-logo" src={icon(c.symbol)} alt={c.name} /><div><h3>{c.name}</h3><span>{c.symbol}</span><div className={`badge ${c.change >= 0 ? 'bullish' : 'bearish'}`}>{c.change >= 0 ? '▲' : '▼'} {c.change.toFixed(2)}%</div></div></div><div className="price"><strong>${c.price.toLocaleString('en-US',{maximumFractionDigits:c.price < 1 ? 4 : 2})}</strong><div className="muted">H {c.high.toLocaleString()} / L {c.low.toLocaleString()}</div><div className="muted">Risk {riskScore(c.change)}/100</div><div className="actions"><a className="btn" href={`/coin/${c.slug}`}>Research</a><button className="btn alt" onClick={() => research(c)}>AI</button><button className="btn ghost" onClick={() => toggleWatch(c.symbol)}>{watchlist.includes(c.symbol) ? 'Saved' : 'Watch'}</button></div></div></div>)}</div>
    <div className="section-title" id="news"><h2>News Sentiment</h2><span className="muted">Real RSS</span></div>
    <div className="news-grid">{news.map(n=><article className="news shine" key={n.title}><span className={`badge ${n.score}`}>{n.score}</span><h3><a href={n.link} target="_blank" rel="noreferrer">{n.title}</a></h3><p className="muted">Source: {n.source}</p><p className="muted">Impact: headline ini cenderung {n.score}. Cocok dipakai sebagai trigger riset lanjutan.</p></article>)}</div>
    <div className="section-title" id="research"><h2>Login, Watchlist & AI Summary</h2><span className="muted">localStorage + JSON database</span></div>
    <div className="grid-bottom"><div className="card glass"><h3>Login ringan</h3><p className="small">Demo login tanpa password. Watchlist tersimpan di file JSON server saat user aktif.</p><div className="login-row"><input className="input" value={username} onChange={e=>setUsername(e.target.value)} /><button className="btn" onClick={login}>Login</button></div><p className="small">User: {user?.username || 'guest/localStorage'}</p><h3>Saved Watchlist</h3><p className="small">{watchlist.length ? watchlist.join(', ') : 'Belum ada coin.'}</p></div><div className="card glass"><h3>AI Summary via 9Router</h3><p className="small preline">{summary}</p><div className="actions"><a className="btn" href="/compare">Open Compare</a><a className="btn alt" href="/coin/btc">BTC Detail</a></div></div></div>
  </section></main>
}
