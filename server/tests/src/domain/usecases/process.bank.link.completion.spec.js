import processBankLinkCompletion from '../../../../src/domain/usecases/processBankLinkCompletion.js'

describe('processBankLinkCompletion', () => {
  const mockBankService = {
    createMultipleBank: jest.fn()
  }

  const mockPlaidImpl = {
    exchangePublicToken: jest.fn(),
    getAccountsData: jest.fn()
  }

  const userId = 'testUser123'
  const publicToken = 'public-token-123'
  const accessToken = 'access-token-123'
  const itemId = 'item-id-123'
  const accountsData = {
    accounts: [{
      account_id: 'account-id-123'
    }]
  }

  beforeEach(() => {
    mockBankService.createMultipleBank.mockReset()
    mockPlaidImpl.exchangePublicToken.mockReset()
    mockPlaidImpl.getAccountsData.mockReset()

    mockPlaidImpl.exchangePublicToken.mockResolvedValue({ accessToken, itemId })
    mockPlaidImpl.getAccountsData.mockResolvedValue(accountsData)
  })

  it('should exchange the public token for access token and item ID, then create bank accounts', async () => {
    const { execute } = processBankLinkCompletion(mockBankService, mockPlaidImpl)

    await execute(userId, publicToken)

    expect(mockPlaidImpl.exchangePublicToken).toHaveBeenCalledWith(publicToken)
    expect(mockPlaidImpl.getAccountsData).toHaveBeenCalledWith(accessToken)
    expect(mockBankService.createMultipleBank).toHaveBeenCalled()
  })

  it('should handle cases with no accounts to process', async () => {
    mockPlaidImpl.getAccountsData.mockResolvedValue({ accounts: [] })
    const { execute } = processBankLinkCompletion(mockBankService, mockPlaidImpl)
    await execute(userId, publicToken)
    expect(mockBankService.createMultipleBank).toHaveBeenCalledWith([])
  })
})
