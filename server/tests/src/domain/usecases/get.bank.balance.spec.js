import getBankBalance from '../../../../src/domain/usecases/getBankBalance.js'

describe('getBankBalance', () => {
  let mockBankService
  let mockPlaidImpl
  let getBankBalanceInstance

  beforeEach(() => {
    mockBankService = {
      retriveBankById: jest.fn()
    }
    mockPlaidImpl = {
      getAccountBalances: jest.fn(),
      getAccountBalancesWithAccountIdFilter: jest.fn()
    }
    getBankBalanceInstance = getBankBalance(mockBankService, mockPlaidImpl)
  })

  it('successfully retrieves and calculates the balance for a specific bank', async () => {
    const bankId = 123
    const userId = 123
    const bank = { id: bankId, userId, accessToken: 'access-token', accountId: 'first' }

    const filterAccountBalance = {
      account_id: 'X74GeaeaZWFoXDmmKkPeUNenXpkxbBFbjrrxB',
      balances: {
        available: 100,
        current: 110,
        iso_currency_code: 'USD',
        limit: null,
        unofficial_currency_code: null
      },
      mask: '0000',
      name: 'Plaid Checking',
      official_name: 'Plaid Gold Standard 0% Interest Checking',
      persistent_account_id: '8cfb8beb89b774ee43b090625f0d61d0814322b43bff984eaf60386e',
      subtype: 'checking',
      type: 'depository'
    }

    mockBankService.retriveBankById.mockResolvedValue(bank)
    mockPlaidImpl.getAccountBalancesWithAccountIdFilter.mockResolvedValue(filterAccountBalance)

    const result = await getBankBalanceInstance.execute(userId, bankId)

    expect(mockBankService.retriveBankById).toHaveBeenCalledWith(bankId)
    expect(mockPlaidImpl.getAccountBalancesWithAccountIdFilter).toHaveBeenCalledWith(bank.accessToken, bank.accountId)
    expect(result).toEqual(filterAccountBalance.balances.available)
  })
})
