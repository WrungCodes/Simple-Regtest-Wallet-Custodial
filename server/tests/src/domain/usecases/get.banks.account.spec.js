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
      getAccountsData: jest.fn()
    }
    getBanksAccountInstance = getBanksAccount(mockBankService, mockPlaidImpl)
  })

  it('successfully retrieves accounts for all user banks', async () => {
    const userId = 123
    const userBanks = [
      { id: 1, accessToken: 'token1', itemId: 'item1' },
      { id: 2, accessToken: 'token2', itemId: '1tem2' }
    ]
    // TODO
    const accountsData = [
      { bankId: '1', accounts: [{ id: 'acc1', balance: 100 }] },
      { bankId: '2', accounts: [{ id: 'acc2', balance: 200 }] }
    ]

    mockBankService.retriveAllUserBanks.mockResolvedValue(userBanks)
    mockPlaidImpl.getAccountsData.mockImplementation((accessToken) =>
      Promise.resolve(accountsData.find(data => data.bankId === accessToken.replace('token', '')))
    )

    const result = await getBanksAccountInstance.execute(userId)

    expect(mockBankService.retriveAllUserBanks).toHaveBeenCalledWith(userId)
    expect(mockPlaidImpl.getAccountsData).toHaveBeenNthCalledWith(1, 'token1')
    expect(mockPlaidImpl.getAccountsData).toHaveBeenNthCalledWith(2, 'token2')
    expect(result).toEqual(accountsData)
  })
})
