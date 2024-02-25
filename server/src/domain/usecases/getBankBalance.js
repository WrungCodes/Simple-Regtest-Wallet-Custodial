export default function getBankBalance (bankService, plaidImpl) {
  const execute = async (id) => {
    const bank = await getSpecificBank(id)
    return getAndReduceBanksAccountBalance(bank)
  }

  const getSpecificBank = async (id) => {
    return await bankService.retriveBankById(id)
  }

  const getAndReduceBanksAccountBalance = async (bank) => {
    const banksAccountBalance = await plaidImpl.getAccountBalances(bank.accessToken)
    const balance = plaidImpl.sumAllAvailableBalances(banksAccountBalance)
    return balance
  }

  return { execute }
}
