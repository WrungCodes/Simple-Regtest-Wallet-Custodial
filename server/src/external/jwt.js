import jwt from 'jsonwebtoken'
import config from '../configs/index.js'

const expirationtimeInMs = config.JWT_EXPIRATION_TIME
const secret = config.JWT_SECRET

export const JWT_TAG = 'jwt'

export default function jwtCookieImplementation () {
  const addCookieBodyParameter = (authenticatedUser) => {
    const payload = {
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      expiration: Date.now() + parseInt(expirationtimeInMs)
    }

    const token = jwt.sign(JSON.stringify(payload), secret)

    return [
      JWT_TAG,
      token,
      {
        httpOnly: true,
        secure: config.IS_PRODUCTION_ENV
      }
    ]
  }

  const getCookieTag = () => JWT_TAG

  return { addCookieBodyParameter, getCookieTag }
}
