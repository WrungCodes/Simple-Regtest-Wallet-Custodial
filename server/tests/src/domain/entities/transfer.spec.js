import Transfer from '../../../../src/domain/entities/transfer.js'

describe('Transfer', () => {
  const id = 1
  const assetId = 1
  const chargeId = 1
  const amount = '100.00'
  const address = 'address'
  const hash = 'hashvalue'
  const status = 'transaction_initizialized'

  test('should return an object with id, assetId, chargeId, amount, address, hash, status properties', () => {
    const transfer = Transfer(id, assetId, chargeId, amount, address, hash, status)

    expect(transfer).toHaveProperty('id')
    expect(transfer).toHaveProperty('assetId')
    expect(transfer).toHaveProperty('chargeId')
    expect(transfer).toHaveProperty('amount')
    expect(transfer).toHaveProperty('address')
    expect(transfer).toHaveProperty('hash')
    expect(transfer).toHaveProperty('status')
  })

  test('should validate an object id, assetId, chargeId, amount, address, hash, status with object properties', () => {
    const transfer = Transfer(id, assetId, chargeId, amount, address, hash, status)

    expect(transfer.id).toBe(id)
    expect(transfer.assetId).toBe(assetId)
    expect(transfer.chargeId).toBe(chargeId)
    expect(transfer.amount).toBe(amount)
    expect(transfer.address).toBe(address)
    expect(transfer.hash).toBe(hash)
    expect(transfer.status).toBe(status)
  })
})
