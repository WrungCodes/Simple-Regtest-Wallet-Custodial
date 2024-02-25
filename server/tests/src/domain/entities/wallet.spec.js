import Wallet from '../../../../src/domain/entities/wallet.js'

describe('Wallet', () => {
  const id = 1
  const userId = 1
  const assetId = 1
  const balance = '100.00'

  test('should return an object with id, userId, assetId, and balance properties', () => {
    const wallet = Wallet(id, userId, assetId, balance)

    expect(wallet).toHaveProperty('id')
    expect(wallet).toHaveProperty('userId')
    expect(wallet).toHaveProperty('assetId')
    expect(wallet).toHaveProperty('balance')
  })

  test('should validate an object id, userId, assetId, and balance with object properties', () => {
    const wallet = Wallet(id, userId, assetId, balance)

    expect(wallet.id).toBe(id)
    expect(wallet.userId).toBe(userId)
    expect(wallet.assetId).toBe(assetId)
    expect(wallet.balance).toBe(balance)
  })
})
