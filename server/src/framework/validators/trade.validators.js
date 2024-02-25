import { body } from 'express-validator'

export const tradeValidator = [
  body('assetId', 'assetId cannot be empty').not().isEmpty(),
  body('assetId', 'assetId must be an Integer').isInt(),

  body('bankId', 'bankId cannot be empty').not().isEmpty(),
  body('bankId', 'assetId must be an Integer').isInt(),

  body('amount', 'amount cannot be empty').not().isEmpty(),
  body('amount', 'amount must be greater than 0').isFloat({ gt: 0 })
]
