import { Form, ActionFunction, redirect, useActionData } from 'remix'

const Index = () => {
	let errors = useActionData()
	return (
		<div>
			<Form method="post">
				<label htmlFor="email">
					Email{errors?.email && ' (is required)'}:
					<input type="text" name="email" id="email" />
				</label>
				<label htmlFor="password">
					Password{errors?.password && ' (is required)'}:
					<input type="password" name="password" id="password" />
				</label>
				<button type="submit">Signup</button>
			</Form>
		</div>
	)
}

export default Index
