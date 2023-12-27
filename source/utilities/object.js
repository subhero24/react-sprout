import { unique } from './array.js';

export function isEquivalentObject(o1, o2) {
	if (o1 instanceof Array && o2 instanceof Array) {
		if (o1.length !== o2.length) return false;

		return o1.every((item, index) => isEquivalentObject(item, o2[index]));
	} else if (o1 instanceof Set && o2 instanceof Set) {
		if (o1.size() !== o2.size()) return false;

		return [...o1].every(value => o2.has(value) || [...o2].some(object => isEquivalentObject(value, object)));
	} else if (typeof o1 === 'object' && typeof o2 === 'object') {
		let keys1 = Object.keys(o1);
		let keys2 = Object.keys(o2);
		let keysAll = unique([...keys1, ...keys2]);

		for (let key in keysAll) {
			if (!isEquivalentObject(o1[key], o2[key])) {
				return false;
			}
		}

		return true;
	}

	return Object.is(o1, o2);
}
