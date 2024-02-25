import config from '../configs/index.js'
import { app } from './express.js'
import { databaseSelector } from '../database/index.js'

const tryInitializingDatabase = async () => {
  try {
    const database = databaseSelector()
    await database.connect()
    await database.setup()
  } catch (error) {
    throw new Error('Database Configuration Error')
  }
}

const start = async () => {
  await tryInitializingDatabase()
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
}

start()
