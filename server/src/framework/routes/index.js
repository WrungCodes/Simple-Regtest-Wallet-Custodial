import { errorHandlerMiddleware } from '../middlewares/error.handler.middleware.js'
import authRouter from '../routes/auth.routes.js'
import bankRouter from '../routes/bank.routes.js'
import assetRouter from '../routes/asset.routes.js'
import tradeRouter from '../routes/trade.routes.js'

export default function routesConfiguration (app, express) {
  app.use('/api/v1/', authRouter(express))
  app.use('/api/v1/bank', bankRouter(express))
  app.use('/api/v1/asset', assetRouter(express))
  app.use('/api/v1/trade', tradeRouter(express))
  app.use(errorHandlerMiddleware)
}
