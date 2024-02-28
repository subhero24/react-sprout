import { useMemo } from 'react';
import Routes, { useForm, useLoaderResult, useNavigate } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function Route() {
	let todos = useLoaderResult();
	let [navigate] = useNavigate();

	let [Form, busy, loading, navigations] = useForm();

	let todoElements = useMemo(() => {
		let optimisticTodos = navigations.map(navigation => {
			return Object.fromEntries(navigation.detail.data);
		});

		function handleClick() {
			navigate({ reload: true });
		}

		return [...todos, ...optimisticTodos].map((todo, index) => {
			return (
				<div key={index} onClick={handleClick}>
					{todo.title}
				</div>
			);
		});
	}, [todos, navigations, navigate]);

	return (
		<>
			<Form method="post" sticky>
				<input type="text" name="title" />
				<button>Submit</button>
			</Form>
			{todoElements}
			{navigations.length}
		</>
	);
}

let actions = [];

async function action({ data }) {
	await sleep(1000);

	let todo = Object.fromEntries(data);
	console.log(todo);
	actions.push(todo);
	return todo;
}

async function loader() {
	await sleep(500);

	return [...actions];
}

let Router = Routes(<Route action={action} loader={loader} />);

export default Router;
