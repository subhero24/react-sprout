// We use this function as a replacement for React.Children.toArray
// as that function returns different elements with their keys set to the indexes of the array
// As the config elements are not rendered directly, the keys do not matter anyway,
// referential identity could be maintained by using this function instead.
export function childrenToArray(children) {
	if (Array.isArray(children)) {
		return children;
	} else if (children == undefined) {
		return [];
	} else {
		return [children];
	}
}
