// import memory from './memory/index.js'
import sequelize from './sequelize/index.js'

export function databaseSelector () {
  return { ...sequelize() }
}
