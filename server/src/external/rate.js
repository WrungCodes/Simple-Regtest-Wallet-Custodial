import axios from 'axios'

const COIN_BASE_RATE_API = 'https://api.coinbase.com/v2/exchange-rates?'

const coinbaseRateStrategy = async (symbol) => {
  try {
    const response = await axios.get(`${COIN_BASE_RATE_API}currency=${symbol.toUpperCase()}`)
    return response.data.data.rates.USD
  } catch (error) {
    throw new Error('Error Retriving Rate')
  }
}

export default function rateImplementationStrategy () {
  return coinbaseRateStrategy
}
