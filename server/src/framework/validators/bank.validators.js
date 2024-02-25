import { body } from 'express-validator'

export const completeBankLinkValidator = [
  body('publicToken', 'Invalid publicToken cannot be Empty').not().isEmpty(),
  body('publicToken', 'Invalid publicToken').isString()
]
