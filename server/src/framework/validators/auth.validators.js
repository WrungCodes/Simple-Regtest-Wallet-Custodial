import { body } from 'express-validator'

export const loginValidator = [
  body('email', 'Invalid email cannot be Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'The minimum password length is 8 characters').isLength({ min: 8 })
]

export const signupValidator = [
  body('name', 'Invalid name cannot be Empty').not().isEmpty(),
  body('email', 'Invalid email cannot be Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'The minimum password length is 8 characters').isLength({ min: 8 })
]
