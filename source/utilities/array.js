export function unique(array) {
	return array.filter((item, index) => array.indexOf(item) === index);
}
