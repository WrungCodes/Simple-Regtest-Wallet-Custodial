import WalletTransaction from '../../../../src/domain/entities/wallet.transaction.js'

describe('WalletTransaction', () => {
  const id = 1
  const walletId = 1
  const hash = 'hashvalue'
  const vout = 1
  const amount = '100.00'

  test('should return an object with id, walletId, hash, vout, amount properties', () => {
    const walletTransaction = WalletTransaction(id, walletId, hash, vout, amount)

    expect(walletTransaction).toHaveProperty('id')
    expect(walletTransaction).toHaveProperty('walletId')
    expect(walletTransaction).toHaveProperty('hash')
    expect(walletTransaction).toHaveProperty('vout')
    expect(walletTransaction).toHaveProperty('amount')
  })

  test('should validate an object id, userId, assetId, and balance with object properties', () => {
    const walletTransaction = WalletTransaction(id, walletId, hash, vout, amount)

    expect(walletTransaction.id).toBe(id)
    expect(walletTransaction.walletId).toBe(walletId)
    expect(walletTransaction.hash).toBe(hash)
    expect(walletTransaction.vout).toBe(vout)
    expect(walletTransaction.amount).toBe(amount)
  })
})
