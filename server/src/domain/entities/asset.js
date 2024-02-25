export default function Asset (id, currency, symbol, decimal, type) {
  return Object.freeze({
    id,
    currency,
    symbol,
    decimal,
    type
  })
}
