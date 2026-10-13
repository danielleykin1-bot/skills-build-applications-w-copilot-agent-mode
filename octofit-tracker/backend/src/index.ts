import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import apiRouter from './routes/index.js'

const app = express()
const codespaceName = process.env.CODESPACE_NAME
const frontendOrigin = codespaceName
  ? `https://${codespaceName}-5173.app.github.dev`
  : 'http://localhost:5173'

app.use(cors({ origin: frontendOrigin }))
app.use(express.json())
app.use(apiRouter)

app.get('/api/health/', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' })
})

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
    return
  }

  if (error instanceof Error && 'name' in error && error.name === 'CastError') {
    response.status(400).json({ error: error.message })
    return
  }

  console.error('API request failed:', error)
  response.status(500).json({ error: 'Internal server error' })
}

app.use(errorHandler)

export default app
