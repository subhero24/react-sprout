import Routes, { Location, useLocation } from '../../../source/index.js';

function Parent(props) {
	return <Location url="other">{props.children}</Location>;
}

function Child() {
	let location = useLocation();

	return location.pathname;
}

let Router = Routes(
	<Parent path="parent">
		<Child />
	</Parent>,
);

export default Router;
