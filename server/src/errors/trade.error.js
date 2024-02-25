import { CustomError } from './custom.error.js'

export class InsuffientBankBalanceError extends CustomError {}
export class DuplicateWalletTransactionError extends CustomError {}
