import {
	Form,
	ActionFunction,
	redirect,
	useActionData,
	useSearchParams,
} from 'remix'
import { hash } from '~/utils/hash.server'
import prisma from '~/utils/db.server'
import { createUserSession, login } from '~/utils/session.server'

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()

	const email = String(formData.get('email'))
	const password = String(formData.get('password'))

	const errors: any = {}
	if (!email) errors.email = true
	if (!password) errors.password = true
	if (!email.includes('@') || !email.includes('.com')) errors.emailFormat = true

	if (Object.keys(errors).length) {
		return errors
	}

	let user = await login({ email, password })
	console.log('User', { user })
	if (!user) {
		return {
			formError: `email/Password combination is incorrect`,
		}
	}

	return createUserSession(user.id, '/dashboard')
}

const Index = () => {
	let errors = useActionData()
	let [searchParams] = useSearchParams()
	return (
		<div className="row justify-content-md-center">
			<div className="col-md-12 col-lg-4">
				<h1>Login</h1>
				<hr />
				{errors?.formError && (
					<div className="alert alert-danger" role="alert">
						Error: Check your email and password
					</div>
				)}
				<Form method="post">
					<div className="mb-3">
						<input
							type="hidden"
							name="redirectTo"
							value={searchParams.get('redirectTo') ?? undefined}
						/>
						<label htmlFor="email" className="form-label">
							Email:
						</label>
						<input
							className="form-control"
							style={{ width: '100%' }}
							type="text"
							name="email"
							id="email"
						/>
						<div className="form-text text-danger">
							{errors?.email && 'Email is required.'}
							{errors?.emailFormat && 'Introduce a valid email.'}
						</div>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password:
						</label>
						<input
							className="form-control"
							type="password"
							name="password"
							id="password"
						/>
						<div className="form-text text-danger">
							{errors?.password && 'Password is required.'}
						</div>
					</div>

					<div className="d-grid gap-2">
						<button className="btn btn-primary" type="submit">
							Login
						</button>
					</div>
				</Form>
			</div>
		</div>
	)
}

export default Index
