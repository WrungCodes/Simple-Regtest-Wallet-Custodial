import Address from '../../../../src/domain/entities/address.js'

describe('Address', () => {
  const id = 1
  const walletId = 1
  const address = '1A2B3C4D5E'
  const privateKey = 'private-key-12345'

  test('should return an object with id, walletId, address, and privateKey properties', () => {
    const addressEntity = Address(id, walletId, address, privateKey)

    expect(addressEntity).toHaveProperty('id')
    expect(addressEntity).toHaveProperty('walletId')
    expect(addressEntity).toHaveProperty('address')
    expect(addressEntity).toHaveProperty('privateKey')
  })

  test('should validate an object id, walletId, address, and privateKey with object properties', () => {
    const addressEntity = Address(id, walletId, address, privateKey)

    expect(addressEntity.id).toBe(id)
    expect(addressEntity.walletId).toBe(walletId)
    expect(addressEntity.address).toBe(address)
    expect(addressEntity.privateKey).toBe(privateKey)
  })
})
