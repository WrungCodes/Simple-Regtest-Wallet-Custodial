import axios from 'axios'
import rateImplementationStrategy from '../../../src/external/rate'

jest.mock('axios')

describe('coinbaseRateStrategy', () => {
  const coinbaseRateStrategy = rateImplementationStrategy()

  it('successfully retrieves the exchange rate', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          rates: {
            USD: '5000'
          }
        }
      }
    })

    const symbol = 'BTC'
    const rate = await coinbaseRateStrategy(symbol)

    expect(axios.get).toHaveBeenCalledWith(`https://api.coinbase.com/v2/exchange-rates?currency=${symbol.toUpperCase()}`)
    expect(rate).toBe('5000')
  })

  it('throws an error when the API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Error Retriving Rate'))

    const symbol = 'BTC'

    await expect(coinbaseRateStrategy(symbol)).rejects.toThrow('Error Retriving Rate')
  })
})
