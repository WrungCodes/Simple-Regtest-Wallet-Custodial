export default function WalletTransaction (id, walletId, hash, vout, amount) {
  return Object.freeze({
    id,
    walletId,
    hash,
    vout,
    amount
  })
}
