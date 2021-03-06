import { Form, ActionFunction, redirect, useActionData } from 'remix'
import { hash } from '~/utils/hash.server'
import prisma from '~/utils/db.server'

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()

	const email = String(formData.get('email'))
	const password = String(formData.get('password'))

	const errors: any = {}
	if (!email) errors.email = true
	if (!password) errors.password = true
	if (!email.includes('@') || !email.includes('.com')) errors.emailFormat = true
	if (password.length < 6) errors.passwordLength = true

	if (Object.keys(errors).length) {
		return errors
	}

	const hashPass = await hash(password)

	try {
		await prisma.user.create({
			data: {
				email,
				password: hashPass,
			},
		})
	} catch (error) {
		errors.duplicated = true
		return errors
	}

	return redirect('/login')
}

const Index = () => {
	let errors = useActionData()
	return (
		<div className="row justify-content-md-center">
			<div className="col-md-12 col-lg-4">
				<h1>Signup</h1>
				<hr />
				{errors?.duplicated && (
					<div className="alert alert-danger" role="alert">
						Email already exists
					</div>
				)}
				<Form method="post">
					<div className="mb-3">
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
							{errors?.passwordLength &&
								'Password must have at least 6 characters.'}
						</div>
					</div>

					<div className="d-grid gap-2">
						<button className="btn btn-primary" type="submit">
							Signup
						</button>
					</div>
				</Form>
			</div>
		</div>
	)
}

export default Index
