export default function Transfer (id, assetId, chargeId, amount, address, hash, status) {
  return Object.freeze({
    id,
    assetId,
    chargeId,
    amount,
    address,
    hash,
    status
  })
}
