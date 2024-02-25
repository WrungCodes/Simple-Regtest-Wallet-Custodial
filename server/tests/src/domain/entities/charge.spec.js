import Charge from '../../../../src/domain/entities/charge.js'

describe('Charge', () => {
  const id = 1
  const bankId = 1
  const userId = 1
  const amount = 500
  const currency = 'USD'
  const timestamp = '123233332122'

  test('should return an object with id, bankId, userId, amount, currency, timestamp properties', () => {
    const charge = Charge(id, bankId, userId, amount, currency, timestamp)

    expect(charge).toHaveProperty('id')
    expect(charge).toHaveProperty('bankId')
    expect(charge).toHaveProperty('userId')
    expect(charge).toHaveProperty('amount')
    expect(charge).toHaveProperty('currency')
    expect(charge).toHaveProperty('timestamp')
  })

  test('should validate an object id, bankId, userId, amount, currency, timestamp with object properties', () => {
    const charge = Charge(id, bankId, userId, amount, currency, timestamp)

    expect(charge.id).toBe(id)
    expect(charge.bankId).toBe(bankId)
    expect(charge.userId).toBe(userId)
    expect(charge.amount).toBe(amount)
    expect(charge.currency).toBe(currency)
    expect(charge.timestamp).toBe(timestamp)
  })
})
