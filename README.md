# CryptoIntel AI

AI Crypto Research Dashboard dengan live market data, news sentiment, risk score, dan AI-style research summary.

## Fitur

- Live market dashboard dari Binance public API
- Advanced search, filter, sort: all/gainers/losers/watchlist
- Demo login + JSON database watchlist
- Auto sentiment-change alert hook with Telegram support
- Multi-coin compare page at `/compare`
- Coin detail chart page with Binance 30D klines
- Coin list: BTC, ETH, SOL, BNB, XRP, DOGE
- 24h change, high/low, volume
- News sentiment section: bullish / bearish / neutral
- AI-style summary untuk headline
- Risk score per coin
- Dark glassmorphism UI
- Responsive mobile/desktop
- API routes: `/api/market`, `/api/rss`, `/api/summary`, `/api/watchlist`, `/api/alerts/check`, `/api/telegram`
- Siap deploy ke Vercel

## Tech Stack

- Next.js App Router
- React
- Binance Public API
- CSS custom dark fintech UI

## Run Local

```bash
npm install
npm run dev
```

Buka:

```txt
http://localhost:3000
```

## Build

```bash
npm run build
```

## Deploy Vercel

- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: default / kosong
- Environment Variables: kosong

## Roadmap

- Real RSS/news fetcher: done via `/api/rss`
- AI summary via 9Router/OpenAI-compatible endpoint: done via `/api/summary`
- Watchlist localStorage: done on dashboard
- Coin detail chart page: done with Binance 30D kline SVG chart
- Telegram alerts: done via `/api/telegram` hook
- Database login

## License

MIT
