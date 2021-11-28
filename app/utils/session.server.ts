import { createCookieSessionStorage, redirect } from '@remix-run/server-runtime'
import prisma from './db.server'
import { verify } from './hash.server'

type LoginForm = {
	email: string
	password: string
}

export async function login({ email, password }: LoginForm) {
	let user = await prisma.user.findUnique({
		where: { email },
	})
	if (!user) return null

	let isCorrectPassword = await verify(password, user.password)
	if (!isCorrectPassword) return null

	return user
}

let sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
	throw new Error('SESSION_SECRET must be set')
}

let storage = createCookieSessionStorage({
	cookie: {
		name: 'RJ_session',
		secure: true,
		secrets: [sessionSecret],
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true,
	},
})

export async function createUserSession(userId: string, redirectTo: string) {
	let session = await storage.getSession()
	session.set('userId', userId)
	return redirect(redirectTo, {
		headers: {
			'Set-cookie': await storage.commitSession(session),
		},
	})
}

export function getUserSession(request: Request) {
	return storage.getSession(request.headers.get('Cookie'))
}

export async function getUserId(request: Request) {
	let session = await getUserSession(request)
	let userId = session.get('userId')

	if (!userId || typeof userId !== 'string') return null
	return userId
}

export async function requireUserId(
	request: Request,
	redirectTo: string = new URL(request.url).pathname
) {
	let session = await getUserSession(request)
	let userId = session.get('userId')

	if (!userId || typeof userId !== 'string') {
		throw redirect(`/login`)
	}

	return userId
}
