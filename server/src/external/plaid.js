import { Configuration, PlaidApi, PlaidEnvironments, Products } from 'plaid'
import config from '../configs/index.js'
import { GetAccountBalanceError, InvalidPlaidPublicTokenError, UnexpectedPlaidRequestError } from '../errors/plaid.error.js'
import math from './math.js'

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': config.PLAID_CLIENT_ID,
      'PLAID-SECRET': config.PLAID_SECRET,
      'Plaid-Version': '2020-09-14'
    }
  }
})

const plaidClient = new PlaidApi(configuration)

const PLAID_PRODUCTS = (config.PLAID_PRODUCTS || Products.Transactions).split(
  ','
)
const PLAID_COUNTRY_CODES = (config.PLAID_COUNTRY_CODES || 'US').split(
  ','
)

export default function plaidImplementation () {
  const createLinkToken = async (userId, name) => {
    const requestConfigs = {
      user: {
        client_user_id: `${userId}`
      },
      client_name: name,
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: 'en'
    }

    const createTokenResponse = await plaidClient.linkTokenCreate(requestConfigs)
    return {
      link: createTokenResponse.data.link_token,
      expiration: createTokenResponse.data.expiration
    }
  }

  const exchangePublicToken = async (publicToken) => {
    try {
      const tokenResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken
      })
      return {
        accessToken: tokenResponse.access_token,
        itemId: tokenResponse.item_id
      }
    } catch (error) {
      console.error(error.response)
      if (error.response?.data?.error_type === 'INVALID_INPUT') {
        throw new InvalidPlaidPublicTokenError(422, 'Invalid public token')
      }
      throw new UnexpectedPlaidRequestError(400, 'Unexpected plaid request error')
    }
  }

  const getAccountsData = async (accessToken) => {
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken
    })
    return { accounts: accountResponse.accounts }
  }

  const getAccountBalances = async (accessToken) => {
    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: accessToken
    })

    return balanceResponse
  }

  const sumAllAvailableBalances = (accountsGetResponse) => {
    if (!Array.isArray(accountsGetResponse.accounts)) {
      throw new GetAccountBalanceError(422, 'Invalid accounts data')
    }

    const totalAvailableBalance = accountsGetResponse.accounts.reduce((total, account) => {
      if (account.balances && typeof account.balances.available === 'number') {
        return math.add(total, account.balances.available)
      }
      return total
    }, 0)
    return totalAvailableBalance
  }

  return {
    exchangePublicToken,
    createLinkToken,
    getAccountsData,
    getAccountBalances,
    sumAllAvailableBalances
  }
}
