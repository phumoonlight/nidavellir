import { RequestHandler, Response } from 'express'
import { vurlFirebase } from './vurl.firebase'
import { utils } from '../../utils'

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
	const payload = utils.initResPayload()
	const authToken = req.headers.authorization
	if (!authToken) {
		payload.code = 'auth_failed_no_token'
		payload.message = 'auth failed: missing auth header'
		payload.success = false
		res.json(payload)
		res.status(401)
		return
	}
	const decodedIdToken = await decodeIdToken(authToken)
	if (!decodedIdToken) {
		payload.code = 'auth_failed_invalid_token'
		payload.message = 'auth failed: invalid token'
		payload.success = false
		res.status(401)
		res.json(payload)
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
