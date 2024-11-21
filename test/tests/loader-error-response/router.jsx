import { Component } from 'react';
import Routes, { useLoaderResult } from '../../../source/index.js';

function loader() {
	return new Response(JSON.stringify({ some: { error: 'value' } }), {
		status: 400,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

function Root(props) {
	return <ErrorBoundary>{props.children}</ErrorBoundary>;
}

function Route() {
	let data = useLoaderResult();

	return JSON.stringify(data);
}

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { error: undefined };
	}

	static getDerivedStateFromError(error) {
		return { error };
	}

	render() {
		if (this.state.error) {
			return 'Something went wrong';
		}

		return this.props.children;
	}
}
let Router = Routes(
	<Root>
		<Route loader={loader} />
	</Root>,
);

export default Router;
