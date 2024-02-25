import { CustomError } from './custom.error.js'

export class EntityNotFoundInDatabase extends CustomError {}
export class EntityRetrivalFromDatabaseFailed extends CustomError {}
export class EntityInsertionIntoDatabaseFailed extends CustomError {}
export class EntityUpdatingDatabaseFailed extends CustomError {}
