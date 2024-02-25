import BTC from '../../../../src/external/crypto-strategy/btc.js'

describe('BTC', () => {
  describe('generateAddress', () => {
    it('should generate a valid address and private key', () => {
      const btc = BTC()
      const result = btc.generateAddress()

      expect(result).toHaveProperty('address')
      expect(result).toHaveProperty('privateKey')

      expect(result.address).toMatch(/^(1|3|m|n)[a-km-zA-HJ-NP-Z1-9]{25,34}$/)

      expect(result.privateKey).toBeDefined()
    })
  })
})
