import Routes, { useActionError } from '../../../source/index.js';

function Route() {
	let error = useActionError();

	return <div id="error">{error.message}</div>;
}

function action() {
	throw new Error('Something went wrong');
}

let Router = Routes(<Route action={action} />);

export default Router;
