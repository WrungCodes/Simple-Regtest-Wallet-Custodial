import developmentConfig from './development.js'
import productionConfig from './production.js'
import localConfig from './local.js'

const environmentConfigs = {
  development: developmentConfig,
  production: productionConfig,
  local: localConfig,
  test: localConfig
}

const environment = process.env.NODE_ENV || 'development'

const currentConfig = environmentConfigs[environment] || developmentConfig

export default currentConfig
