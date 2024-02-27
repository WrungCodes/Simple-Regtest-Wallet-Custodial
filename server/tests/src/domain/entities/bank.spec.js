import Bank from '../../../../src/domain/entities/bank.js'

describe('Bank', () => {
  const id = 1
  const accountId = 'an-account-id'
  const userId = 1
  const accessToken = 'an-access-token'
  const itemId = 'an-item-id'

  test('should return an object with id, accountId, userId, accessToken, itemId properties', () => {
    const bank = Bank(id, accountId, userId, accessToken, itemId)

    expect(bank).toHaveProperty('id')
    expect(bank).toHaveProperty('accountId')
    expect(bank).toHaveProperty('userId')
    expect(bank).toHaveProperty('accessToken')
    expect(bank).toHaveProperty('itemId')
  })

  test('should validate an object id, accountId, userId, accessToken, itemId with object properties', () => {
    const bank = Bank(id, accountId, userId, accessToken, itemId)

    expect(bank.id).toBe(id)
    expect(bank.accountId).toBe(accountId)
    expect(bank.userId).toBe(userId)
    expect(bank.accessToken).toBe(accessToken)
    expect(bank.itemId).toBe(itemId)
  })
})
