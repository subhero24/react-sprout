import { Component } from 'react';
import Routes, { Link, useLoaderResult } from '../../../source/index.js';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { error: undefined };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { error };
	}

	render() {
		if (this.state.error) {
			return this.state.error.message;
		}

		return this.props.children;
	}
}

function Parent(props) {
	return <ErrorBoundary>{props.children}</ErrorBoundary>;
}

function Child(props) {
	let data = useLoaderResult();

	return 'child';
}

async function loader() {
	throw new Error('message');
}

let Router = Routes(
	<Parent>
		<Child loader={loader} />
	</Parent>,
);

export default Router;
