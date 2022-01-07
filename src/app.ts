import express from 'express'
import cors from 'cors'
import { apiController } from './api/api'

export const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', apiController)

app.get('/favicon.ico', (req, res) => {
	res.sendStatus(204)
})

app.get('/', (req, res) => {
	res.send('nidavellir online')
})