import getBanksAccount from '../../../../src/domain/usecases/getBanksAccount.js'

describe('getBanksAccount', () => {
  let mockBankService
  let mockPlaidImpl
  let getBanksAccountInstance

  beforeEach(() => {
    mockBankService = {
      retriveAllUserBanks: jest.fn()
    }
    mockPlaidImpl = {
      getAccountsData: jest.fn(),
      getAccountsDataWithAccountIdFilter: jest.fn()
    }
    getBanksAccountInstance = getBanksAccount(mockBankService, mockPlaidImpl)
  })

  it('successfully retrieves accounts for all user banks', async () => {
    const userId = 123
    const userBanks = [
      { id: 1, accessToken: 'token1', itemId: 'item1', accountId: 'first' },
      { id: 2, accessToken: 'token2', itemId: '1tem2', accountId: 'second' }
    ]

    const filterAccount = {
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

    mockBankService.retriveAllUserBanks.mockResolvedValue(userBanks)
    mockPlaidImpl.getAccountsDataWithAccountIdFilter.mockResolvedValue(filterAccount)

    const result = await getBanksAccountInstance.execute(userId)

    expect(mockBankService.retriveAllUserBanks).toHaveBeenCalledWith(userId)
    expect(mockPlaidImpl.getAccountsDataWithAccountIdFilter).toHaveBeenNthCalledWith(1, 'token1', 'first')
    expect(mockPlaidImpl.getAccountsDataWithAccountIdFilter).toHaveBeenNthCalledWith(2, 'token2', 'second')
    expect(result).toEqual([{ id: 1, ...filterAccount }, { id: 2, ...filterAccount }])
  })
})
