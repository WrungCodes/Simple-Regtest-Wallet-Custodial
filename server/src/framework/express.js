import express from 'express'
import morgan from 'morgan'
import compression from 'compression'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import passportConfiguration from '../external/passport.js'
import routesConfiguration from './routes/index.js'
import { fileURLToPath } from 'url'
import path from 'path'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// app.use(cors())
// app.use(function(req, res, next) {
//   res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
//   res.setHeader('Access-Control-Allow-Headers', 'http://localhost:4000');
//   next();
// });

app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'],
      defaultSrc: ["'self'", 'https://cdn.plaid.com/'],
      frameSrc: ["'self'", 'https://cdn.plaid.com/'],
      connectSrc: ["'self'", 'https://sandbox.plaid.com']
    }
  })
)

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

app.use(express.static(path.join(__dirname, '../../public/build'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Opener-Policy', 'localhost');
    res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  }
}))

app.get('/test', (req, res) => res.send({ message: 'Server running' }))

routesConfiguration(app, express)
passportConfiguration()

export { app }
