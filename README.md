# CryptoIntel AI

AI Crypto Research Dashboard dengan live market data, news sentiment, risk score, dan AI-style research summary.

## Fitur

- Live market dashboard dari Binance public API
- Coin list: BTC, ETH, SOL, BNB, XRP, DOGE
- 24h change, high/low, volume
- News sentiment section: bullish / bearish / neutral
- AI-style summary untuk headline
- Risk score per coin
- Dark glassmorphism UI
- Responsive mobile/desktop
- API routes: `/api/market` dan `/api/news`
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

- Real RSS/news fetcher
- AI summary via 9Router/OpenRouter
- Watchlist localStorage
- Coin detail chart page
- Telegram alerts
- Database login

## License

MIT
