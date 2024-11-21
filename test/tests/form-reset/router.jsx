import Routes, { useForm } from '../../../source/index.js';

function Route() {
	let [Form] = useForm();

	function handleNavigateEnd(event) {
		event.originalEvent.target.reset();
	}

	return (
		<Form method="post" onNavigateEnd={handleNavigateEnd}>
			<input id="text" type="text" />
			<button type="submit">Submit and reset</button>
		</Form>
	);
}

let Router = Routes(<Route />);

export default Router;
