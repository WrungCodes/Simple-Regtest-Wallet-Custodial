import { BadTradeRequestError } from '../../errors/trade.error.js'

export default function getBankBalance (bankService, plaidImpl) {
  const execute = async (userId, bankId) => {
    const bank = await getSpecificBank(bankId)
    isUserAuthorizedToAccessBank(userId, bank)
    return getAndReduceBanksAccountBalance(bank)
  }

  const getSpecificBank = async (id) => {
    return await bankService.retriveBankById(id)
  }

  const isUserAuthorizedToAccessBank = async (userId, bank) => {
    if (userId !== bank.userId) {
      throw new BadTradeRequestError(400, 'Bad Request')
    }
  }

  const getAndReduceBanksAccountBalance = async (bank) => {
    const bankAccountBalance = await plaidImpl.getAccountBalancesWithAccountIdFilter(bank.accessToken, bank.accountId)
    const balance = bankAccountBalance.balances.available
    return balance
  }

  return { execute }
}
