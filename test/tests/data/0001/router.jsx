import Routes, { useData } from '../../../../source/index.js';

function Parent(props) {
	let data = useData();

	return (
		<>
			<div id="parent-data">{JSON.stringify(data)}</div>
			{props.children}
		</>
	);
}

function Child(props) {
	let data = useData();

	return <div id="child-data">{JSON.stringify(data)}</div>;
}

let Router = Routes(
	<Parent path="parent" data={'parent'}>
		<Child path="child" data={'child'} />
	</Parent>,
);

export default Router;
