import { useState } from 'react';

export default function Application() {
	let [count, setCount] = useState(0);

	function handleClick() {
		setCount(count => count + 1);
	}

	return (
		<main onClick={handleClick}>
			application: <span>{count}</span>
		</main>
	);
	// return (
	// 	<html>
	// 		<head>
	// 			<meta charSet="utf-8" />
	// 			<title>App</title>
	// 		</head>
	// 		<body>application</body>
	// 	</html>
	// );
}
