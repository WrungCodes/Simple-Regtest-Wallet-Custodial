export default function getBanksAccount (bankService, plaidImpl) {
  const execute = async (userId) => {
    const allUserBanks = await getAllUserBanks(userId)
    return loopAndGetBanksAccounts(allUserBanks)
  }

  const getAllUserBanks = async (userId) => {
    return await bankService.retriveAllUserBanks(userId)
  }

  const loopAndGetBanksAccounts = async (allUserBanks) => {
    const banksAccountsPromises = allUserBanks.map(bank =>
      plaidImpl.getAccountsDataWithAccountIdFilter(bank.accessToken, bank.accountId)
        .then(accountsData => ({
          ...accountsData,
          id: bank.id
        }))
    )
    const banksAccountsNestedArray = await Promise.all(banksAccountsPromises)
    return formatBankAccountResponse(banksAccountsNestedArray)
  }

  const formatBankAccountResponse = async (banksAccountsNestedArray) => {
    const banksAccounts = []
    for (const banksAccountsObject of banksAccountsNestedArray) {
      banksAccounts.push({ id: banksAccountsObject.id, ...banksAccountsObject })
    }
    return banksAccounts
  }

  return { execute }
}
