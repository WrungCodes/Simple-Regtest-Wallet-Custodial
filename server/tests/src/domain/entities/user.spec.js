import User from '../../../../src/domain/entities/user.js'

describe('User', () => {
  const name = 'daniel'
  const email = 'example@email.com'
  const password = 'a-good-password'

  test('should return an object with name, email, and password properties', () => {
    const user = User(name, email, password)

    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('password')
  })

  test('should validate an object name, email, and password with object properties', () => {
    const user = User(name, email, password)

    expect(user.name).toBe(name)
    expect(user.email).toBe(email)
    expect(user.password).toBe(password)
  })
})
