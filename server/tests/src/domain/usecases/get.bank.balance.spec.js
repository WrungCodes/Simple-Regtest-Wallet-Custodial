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
      sumAllAvailableBalances: jest.fn()
    }
    getBankBalanceInstance = getBankBalance(mockBankService, mockPlaidImpl)
  })

  it('successfully retrieves and calculates the balance for a specific bank', async () => {
    const bankId = 123
    const bank = { id: bankId, accessToken: 'access-token' }
    const accountBalances = [{ balance: 100 }, { balance: 200 }] // TODO
    const totalBalance = 300

    mockBankService.retriveBankById.mockResolvedValue(bank)
    mockPlaidImpl.getAccountBalances.mockResolvedValue(accountBalances)
    mockPlaidImpl.sumAllAvailableBalances.mockReturnValue(totalBalance)

    const result = await getBankBalanceInstance.execute(bankId)

    expect(mockBankService.retriveBankById).toHaveBeenCalledWith(bankId)
    expect(mockPlaidImpl.getAccountBalances).toHaveBeenCalledWith(bank.accessToken)
    expect(mockPlaidImpl.sumAllAvailableBalances).toHaveBeenCalledWith(accountBalances)
    expect(result).toEqual(totalBalance)
  })
})
