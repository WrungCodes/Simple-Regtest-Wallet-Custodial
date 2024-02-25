import encryptionImplementation from '../../../src/external/encryption.js'

describe('encryptionImplementation', () => {
  const secretKey = 'testSecretKeyHere'
  const secretIv = 'testSecretIvHere'
  const encryptionMethod = 'aes-256-cbc'

  const { encrypt, decrypt } = encryptionImplementation(secretKey, secretIv, encryptionMethod)

  it('should encrypt and decrypt data correctly, returning the original data', () => {
    const originalData = 'Hello, Exodus!'
    const encryptedData = encrypt(originalData)
    const decryptedData = decrypt(encryptedData)

    expect(decryptedData).toBe(originalData)
  })

  it('should produce different encrypted outputs for the same input with different IVs', () => {
    const alternativeIv = 'differentSecretIv'
    const { encrypt: encryptWithDifferentIv } = encryptionImplementation(secretKey, alternativeIv, encryptionMethod)
    const originalData = 'Hello, Exodus!'
    const encryptedData = encrypt(originalData)
    const encryptedDataWithDifferentIv = encryptWithDifferentIv(originalData)

    expect(encryptedData).not.toBe(encryptedDataWithDifferentIv)
  })
})
