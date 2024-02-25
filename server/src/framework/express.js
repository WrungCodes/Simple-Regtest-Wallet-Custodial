import express from 'express'
import morgan from 'morgan'
import compression from 'compression'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import passportConfiguration from '../external/passport.js'
import routesConfiguration from './routes/index.js'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(compression())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  })
)
app.use(passport.initialize())
app.use(morgan('combined'))

app.get('/test', (req, res) => res.send({ message: 'Server running' }))

routesConfiguration(app, express)
passportConfiguration()

export { app }
