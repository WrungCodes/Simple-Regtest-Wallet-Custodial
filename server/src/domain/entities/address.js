export default function Address (id, walletId, address, privateKey) {
  return Object.freeze({
    id,
    walletId,
    address,
    privateKey
  })
}
