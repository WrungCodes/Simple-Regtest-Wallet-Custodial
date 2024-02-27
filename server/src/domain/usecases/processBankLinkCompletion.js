export default function processBankLinkCompletion (bankService, plaidImpl) {
  const execute = async (userId, publicToken) => {
    const { accessToken, itemId } = await plaidImpl.exchangePublicToken(publicToken)
    const bankData = await plaidImpl.getAccountsData(accessToken)
    await createAllBankAccountInBankData(bankData, userId, itemId, accessToken)
  }

  const createAllBankAccountInBankData = async (bankData, userId, itemId, accessToken) => {
    const banks = formatBankAccountForInsert(bankData.accounts, userId, itemId, accessToken)
    await bankService.createMultipleBank(banks)
  }

  const formatBankAccountForInsert = (accounts, userId, itemId, accessToken) => {
    const banks = []
    for (const account of accounts) {
      banks.push({
        accountId: account.account_id,
        userId,
        accessToken,
        itemId
      })
    }
    return banks
  }

  return { execute }
}
