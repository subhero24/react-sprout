import Routes, { Link } from '../../../source/index.js';

function Parent(props) {
	return <Link href="other">Navigate</Link>;
}

let Router = Routes(<Parent path="parent/*" />);

export default Router;
