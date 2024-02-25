import crypto from 'crypto'

export default function encryptionImplementation (secretKey, secretIv, ecnryptionMethod) {
  const encrypt = (data) => {
    const { key, encryptionIV } = keys()
    const cipher = crypto.createCipheriv(ecnryptionMethod, key, encryptionIV)
    return Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')).toString('base64')
  }

  const decrypt = (data) => {
    const { key, encryptionIV } = keys()
    const buff = Buffer.from(data, 'base64')
    const decipher = crypto.createDecipheriv(ecnryptionMethod, key, encryptionIV)
    return (decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8'))
  }

  const keys = () => {
    const key = crypto
      .createHash('sha512')
      .update(secretKey)
      .digest('hex')
      .substring(0, 32)
    const encryptionIV = crypto
      .createHash('sha512')
      .update(secretIv)
      .digest('hex')
      .substring(0, 16)

    return { key, encryptionIV }
  }

  return { encrypt, decrypt }
}
