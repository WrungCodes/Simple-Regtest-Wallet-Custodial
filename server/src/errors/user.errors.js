import { CustomError } from './custom.error.js'

export class DuplicateEmailError extends CustomError {}
export class UnauthorizedUserError extends CustomError {}
export class InvalidLoginCredentialError extends CustomError {}
