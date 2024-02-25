export default function Charge (id, userId, bankId, amount, currency, timestamp) {
  return Object.freeze({
    id,
    bankId,
    userId,
    amount,
    currency,
    timestamp
  })
}
