import memory from '../../../src/database/memory/index.js'

describe('Memory Database Repository', () => {
  let memDb

  beforeAll(() => {
    memDb = memory()
    memDb.setup()
  })

  test('insert and findById functionality', async () => {
    const userRepo = memDb.repository().user
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' }

    await userRepo.insert(user)

    const foundUser = await userRepo.findById('1')
    expect(foundUser).toEqual(user)
  })

  test('findBy property functionality', async () => {
    const userRepo = memDb.repository().user
    const user = { id: '2', name: 'Jane Doe', email: 'jane@example.com' }

    await userRepo.insert(user)

    const foundUserByEmail = await userRepo.findBy('email', 'jane@example.com')
    expect(foundUserByEmail).toEqual(user)
  })
})
