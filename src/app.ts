import express from 'express'
import cors from 'cors'
import { apiRouter } from './router'
import pkg from '../package.json'

export const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', apiRouter)

app.get('/favicon.ico', (req, res) => {
	res.sendStatus(204)
})

app.get('/', (req, res) => {
	res.json({
		message: 'nidavellir online',
		version: pkg.version,
		repository: pkg.repository.url
	})
})
