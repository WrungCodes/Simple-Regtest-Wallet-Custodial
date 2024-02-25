import { CustomError } from './custom.error.js'

export class GetAccountBalanceError extends CustomError {}
export class InvalidPlaidPublicTokenError extends CustomError {}
export class UnexpectedPlaidRequestError extends CustomError {}
