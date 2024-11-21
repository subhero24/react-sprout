import Routes, { Link } from '../../../source/index.js';

function Parent(props) {
	return (
		<Link href="other" relative={false}>
			Navigate
		</Link>
	);
}

let Router = Routes(<Parent path="parent/*" />);

export default Router;
