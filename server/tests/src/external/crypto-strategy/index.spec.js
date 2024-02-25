import cryptoImplementationStrategy from '../../../../src/external/crypto-strategy/index.js'

jest.mock('../../../../src/external/crypto-strategy/btc.js', () => {
  return function () {
    return {
      generateAddress: jest.fn().mockReturnValue({ address: 'mockAddress', privateKey: 'mockPrivateKey' })
    }
  }
})

describe('cryptoImplementationStrategy', () => {
  describe('when asset is supported', () => {
    it('returns an object with a generateAddress function for BTC and calls it', () => {
      const strategy = cryptoImplementationStrategy()
      const assetStrategy = strategy('btc')

      expect(assetStrategy).toHaveProperty('generateAddress')
      expect(typeof assetStrategy.generateAddress).toBe('function')

      const addressResult = assetStrategy.generateAddress()
      expect(addressResult).toEqual({ address: 'mockAddress', privateKey: 'mockPrivateKey' })
    })
  })
  describe('when asset is not supported', () => {
    it('throws an error', () => {
      const unsupportedAsset = () => cryptoImplementationStrategy()('anothercrypto')
      expect(unsupportedAsset).toThrow('Asset Not Implemented')
    })
  })
})
