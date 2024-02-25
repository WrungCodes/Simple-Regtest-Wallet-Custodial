import Bank from '../../domain/entities/bank.js'
import getBanksAccount from '../../domain/usecases/getBanksAccount.js'

export default function bankController (bankService, plaidImpl) {
  const startBanklink = async (req, res, next) => {
    const { name, id } = res.locals.user
    const { link, expiration } = await plaidImpl.createLinkToken(id, name)
    res.json({ link, expiration })
  }

  const completeBanklink = async (req, res, next) => {
    const { id } = res.locals.user
    const { publicToken } = req.body

    const { accessToken, itemId } = await plaidImpl.exchangePublicToken(publicToken)

    const bank = Bank(null, 'plaid', id, accessToken, itemId)
    await bankService.createBank(bank)

    const getBanksAccountUsecase = getBanksAccount(bankService, plaidImpl)
    const accounts = await getBanksAccountUsecase.execute(id)
    res.json({ accounts })
  }

  return {
    startBanklink,
    completeBanklink
  }
}
