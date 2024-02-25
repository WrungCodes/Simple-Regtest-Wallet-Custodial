import Asset from '../../../../src/domain/entities/asset.js'

describe('Asset', () => {
  const id = 1
  const currency = 'US Dollar'
  const symbol = 'USD'
  const decimal = 6
  const type = 'fiat'

  test('should return an object with id, currency, symbol, decimal, and type properties', () => {
    const asset = Asset(id, currency, symbol, decimal, type)

    expect(asset).toHaveProperty('id')
    expect(asset).toHaveProperty('currency')
    expect(asset).toHaveProperty('symbol')
    expect(asset).toHaveProperty('decimal')
    expect(asset).toHaveProperty('type')
  })

  test('should validate an object id, currency, symbol, decimal, and type with object properties', () => {
    const asset = Asset(id, currency, symbol, decimal, type)

    expect(asset.id).toBe(id)
    expect(asset.currency).toBe(currency)
    expect(asset.symbol).toBe(symbol)
    expect(asset.decimal).toBe(decimal)
    expect(asset.type).toBe(type)
  })
})
