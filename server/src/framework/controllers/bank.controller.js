import getBanksAccount from '../../domain/usecases/getBanksAccount.js'
import processBankLinkCompletion from '../../domain/usecases/processBankLinkCompletion.js'

export default function bankController (bankService, plaidImpl) {
  const startBanklink = async (req, res, next) => {
    const { name, id } = res.locals.user
    const { link, expiration } = await plaidImpl.createLinkToken(id, name)
    res.json({ link, expiration })
  }

  const completeBanklink = async (req, res, next) => {
    const userId = res.locals.user.id
    const { publicToken } = req.body

    const processBankLinkCompletionUseCase = processBankLinkCompletion(bankService, plaidImpl)
    const getBanksAccountUsecase = getBanksAccount(bankService, plaidImpl)

    await processBankLinkCompletionUseCase.execute(userId, publicToken)
    const accounts = await getBanksAccountUsecase.execute(userId)
    res.json({ accounts })
  }

  return {
    startBanklink,
    completeBanklink
  }
}

// {
//   accounts: [
//     {
//       account_id: '4l1M7Z5PnwhoydwZQdboS1K9MbvPe8CJMqVr1',
//       balances: [Object],
//       mask: '0000',
//       name: 'Plaid Checking',
//       official_name: 'Plaid Gold Standard 0% Interest Checking',
//       persistent_account_id: '8cfb8beb89b774ee43b090625f0d61d0814322b43bff984eaf60386e',
//       subtype: 'checking',
//       type: 'depository'
//     },
//     {
//       account_id: 'NWJAzPD98VCz8EAxaEkziKnmyMpl3LTyKbpjv',
//       balances: [Object],
//       mask: '1111',
//       name: 'Plaid Saving',
//       official_name: 'Plaid Silver Standard 0.1% Interest Saving',
//       persistent_account_id: '211a4e5d8361a3afb7a3886362198c7306e00a313b5aa944c20d34b6',
//       subtype: 'savings',
//       type: 'depository'
//     }
//   ],
//   item: {
//     available_products: [
//       'assets',
//       'balance',
//       'signal',
//       'identity',
//       'identity_match',
//       'investments',
//       'liabilities',
//       'recurring_transactions',
//       'transfer'
//     ],
//     billed_products: [ 'auth', 'transactions' ],
//     consent_expiration_time: null,
//     error: null,
//     institution_id: 'ins_56',
//     item_id: 'RbqRdGD9wJSdPpgN6p9diXVB4Z3GoJCReERxd',
//     products: [ 'auth', 'transactions' ],
//     update_type: 'background',
//     webhook: ''
//   },
//   request_id: 'YXcIrCpPILmYmQO'
// }
