import Routes, { Form, useActionErrors } from '../../../source/index.js';

function Route() {
	let [errors, dismiss] = useActionErrors();

	return (
		<>
			<Form method="post">
				<button>submit</button>
			</Form>
			{errors.map((error, index) => (
				<div key={index} className="error" onClick={() => dismiss(error)}>
					{error.message}
				</div>
			))}
		</>
	);
}

function action() {
	throw new Error('Something went wrong');
}

let Router = Routes(<Route action={action} />);

export default Router;
