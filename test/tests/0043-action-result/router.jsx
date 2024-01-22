import Routes, { Form, useActionResult } from '../../../source/index.js';

function Parent(props) {
	let action = useActionResult();

	return (
		<>
			<div id="action-parent">{action}</div>
			<div>{props.children}</div>
		</>
	);
}

function ChildA() {
	return (
		<Form action="/b" method="post">
			<button name="name" value="value">
				Submit
			</button>
		</Form>
	);
}

function ChildB() {
	let action = useActionResult();

	return <div id="action-child">{action}</div>;
}

function action() {
	return 'action';
}

let Router = Routes(
	<Parent action={action}>
		<ChildA path="a" />
		<ChildB path="b" />
	</Parent>,
);

export default Router;
