export default function Wallet (id, userId, assetId, balance) {
  return Object.freeze({
    id,
    userId,
    assetId,
    balance
  })
}
