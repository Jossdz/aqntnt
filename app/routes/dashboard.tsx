import { LoaderFunction, redirect } from '@remix-run/server-runtime'
import React from 'react'
import { getUserId, requireUserId } from '~/utils/session.server'

interface Props {}

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await requireUserId(request)

	return null
}

const dashboard = (props: Props) => {
	return (
		<div>
			<h1>Dashboard</h1>
		</div>
	)
}

export default dashboard
