import passwordImplementation from '../../../src/external/password.js'

describe('passwordImplementation', () => {
  const passwordImpl = passwordImplementation()

  describe('toHash', () => {
    it('generates a hash in the correct format', async () => {
      const password = 'myPassword'
      const hash = await passwordImpl.toHash(password)

      expect(hash).toMatch(/\w+\.\w+/) // Basic check for "hash.salt" format
    })
  })

  describe('compare', () => {
    it('returns true for matching passwords', async () => {
      const password = 'testPassword'
      const hash = await passwordImpl.toHash(password)

      const match = await passwordImpl.compare(hash, password)
      expect(match).toBe(true)
    })

    it('returns false for non-matching passwords', async () => {
      const password = 'testPassword'
      const wrongPassword = 'wrongPassword'
      const hash = await passwordImpl.toHash(password)

      const match = await passwordImpl.compare(hash, wrongPassword)
      expect(match).toBe(false)
    })
  })
})
