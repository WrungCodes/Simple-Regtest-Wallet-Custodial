export default function getBanksAccount (bankService, plaidImpl) {
  const execute = async (userId) => {
    const allUserBanks = await getAllUserBanks(userId)
    return loopAndGetBanksAccounts(allUserBanks)
  }

  const getAllUserBanks = async (userId) => {
    return await bankService.retriveAllUserBanks(userId)
  }

  const loopAndGetBanksAccounts = async (allUserBanks) => {
    const banksAccountsPromises = allUserBanks.map(bank => plaidImpl.getAccountsData(bank.accessToken))
    const banksAccounts = await Promise.all(banksAccountsPromises)
    return banksAccounts
  }

  return { execute }
}
