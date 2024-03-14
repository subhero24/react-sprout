import Router from './router.jsx';

import { useState } from 'react';

export default function Application() {
	let [count, setCount] = useState(0);

	function handleClick() {
		setCount(count => count + 1);
	}

	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<title>App</title>
			</head>
			<body>
				<main onClick={handleClick}>
					application: <span>{count}</span>
				</main>
				<Router />
			</body>
		</html>
	);
}
