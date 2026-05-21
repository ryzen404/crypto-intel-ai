
const coins = [
  { symbol:'BTCUSDT', slug:'btc', name:'Bitcoin' },
  { symbol:'ETHUSDT', slug:'eth', name:'Ethereum' },
  { symbol:'SOLUSDT', slug:'sol', name:'Solana' },
  { symbol:'BNBUSDT', slug:'bnb', name:'BNB' },
  { symbol:'XRPUSDT', slug:'xrp', name:'XRP' },
  { symbol:'DOGEUSDT', slug:'doge', name:'Dogecoin' }
]

async function ticker(symbol){ const r=await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`,{next:{revalidate:30}}); return r.json() }
function risk(change){return Math.round(Math.min(95,45+Math.abs(change)*4))}

export default async function ComparePage(){
  const rows = await Promise.all(coins.map(async c=>{const x=await ticker(c.symbol); const change=Number(x.priceChangePercent); return {...c, price:Number(x.lastPrice), change, volume:Number(x.volume), risk:risk(change)}}))
  return <main className="page"><section className="wrap"><nav className="nav glass"><div className="brand"><div className="brand-icon">CMP</div><div><h1>Multi-Coin Compare</h1><p>Bandingkan price, change, volume, risk</p></div></div><a className="btn" href="/">Dashboard</a></nav><div className="card glass"><table className="table"><thead><tr><th>Coin</th><th>Price</th><th>24h</th><th>Volume</th><th>Risk</th><th>Research</th></tr></thead><tbody>{rows.map(c=><tr key={c.symbol}><td>{c.name}</td><td>${c.price.toLocaleString('en-US',{maximumFractionDigits:c.price<1?4:2})}</td><td className={c.change>=0?'green':'red'}>{c.change.toFixed(2)}%</td><td>{Math.round(c.volume).toLocaleString()}</td><td>{c.risk}/100</td><td><a className="btn" href={`/coin/${c.slug}`}>Open</a></td></tr>)}</tbody></table></div></section></main>
}
