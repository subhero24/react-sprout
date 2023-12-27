export default function append(node, element) {
	let result = document.createElement(element.type);

	for (let prop in element.props) {
		result[prop] = element.props[prop];
	}

	node.appendChild(result);

	return result;
}
