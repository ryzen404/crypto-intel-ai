import './globals.css'

export const metadata = {
  title: 'CryptoIntel AI — AI Crypto Research Dashboard',
  description: 'AI crypto research dashboard with live Binance market data, news sentiment, risk score, and AI-style summaries.',
  openGraph: {
    title: 'CryptoIntel AI',
    description: 'Live crypto prices, news sentiment, risk score, and AI-style research summaries.',
    type: 'website'
  }
}

export default function RootLayout({ children }) {
  return <html lang="id"><body>{children}</body></html>
}
