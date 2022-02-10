import { RequestHandler, Response } from 'express'
import { firebaseAuth } from './bookmark.firebase'
import { ResponsePayload } from '../../response'

const decodeIdToken = async (token: string) => {
	try {
		const decodedIdToken = await firebaseAuth.verifyIdToken(token)
		return decodedIdToken
	} catch (error) {
		console.log(error)
		return null
	}
}

export const useFirebaseAuth: RequestHandler = async (req, res, next) => {
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

export const getAuthorizedUserId = (res: Response): string => {
	return res.locals.decodedIdToken?.uid || ''
}
