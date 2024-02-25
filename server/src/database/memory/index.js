const userDb = new Map()

const makeBaseRepository = (db) => ({
  findById: async (id) => db.get(id),
  insert: async (entity) => db.set(entity.id, entity),
  findBy: async (propertyName, value) => [...db.values()].find(entity => entity[propertyName] === value)
})

export default function memory () {
  function setUpMemoryDatabase () {
    runMigration()
    runSeeder()
  }

  function runMigration () { }
  function runSeeder () { }

  function repository () {
    return {
      user: makeBaseRepository(userDb)
    }
  }

  return Object.freeze({
    connect: async () => { },
    setup: async () => { setUpMemoryDatabase() },
    repository
  })
}
