import { RequestHandler, Response } from 'express'
import { vurlFirebase } from './vurl.firebase'
import { ResponsePayload } from '../../response'

const decodeIdToken = async (token: string) => {
	try {
		const decodedIdToken = await vurlFirebase.auth.verifyIdToken(token)
		return decodedIdToken
	} catch (error) {
		console.log(error)
		return null
	}
}

const getUserId = (res: Response): string => {
	return res.locals.decodedIdToken?.uid || ''
}

const handleAuth: RequestHandler = async (req, res, next) => {
	const response = new ResponsePayload()
	const incomingToken = req.headers.authorization
	if (!incomingToken) {
		res.status(401)
		response.message = 'missing authorization header'
		res.json(response)
		return
	}
	const decodedIdToken = await decodeIdToken(incomingToken)
	if (!decodedIdToken) {
		res.status(401)
		response.message = 'authorization failed: invalid token'
		res.json(response)
		return
	}
	res.locals.decodedIdToken = decodedIdToken
	next()
}

export const vurlAuth = {
	decodeIdToken,
	getUserId,
	handleAuth,
}
