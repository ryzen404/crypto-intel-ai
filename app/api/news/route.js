export async function GET() {
  return Response.json({
    ok: true,
    news: [
      { title: 'ETF inflow naik, sentimen market membaik', source: 'CoinDesk', sentiment: 'bullish' },
      { title: 'Trader waspada liquidation saat volatilitas naik', source: 'Decrypt', sentiment: 'neutral' },
      { title: 'Update jaringan besar dorong minat investor', source: 'Cointelegraph', sentiment: 'bullish' }
    ]
  })
}
