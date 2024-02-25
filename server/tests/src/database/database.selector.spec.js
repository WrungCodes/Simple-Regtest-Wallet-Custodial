import { databaseSelector } from '../../../src/database/index.js'

describe('Database Selector', () => {
  test('should return an object with connect, setup, and repository methods', () => {
    const db = databaseSelector()

    expect(db).toHaveProperty('connect')
    expect(typeof db.connect).toBe('function')

    expect(db).toHaveProperty('setup')
    expect(typeof db.setup).toBe('function')

    expect(db).toHaveProperty('repository')
    expect(typeof db.repository).toBe('function')
  })
})
