export function filterQuery(query, descriptorQuery) {
	let result = new URLSearchParams();
	let search = new URLSearchParams(query);

	if (descriptorQuery == undefined || descriptorQuery === '') {
		return result;
	} else {
		let descriptorSearchParams = new URLSearchParams(descriptorQuery);
		let descriptorSearchParamsKeys = [...descriptorSearchParams.keys()];
		let descriptorSearchParamsEmpty = descriptorSearchParamsKeys.length === 0;

		for (let [key, value] of search) {
			if (descriptorSearchParamsEmpty || descriptorSearchParams.get(key) != undefined) {
				result.append(key, value);
			}
		}

		return result;
	}
}

export function matchQuery(descriptorQuery, locationQuery, strict = false) {
	if (strict) {
		let locationQuestionMark = locationQuery.startsWith('?');
		let descriptorQuestionMark = descriptorQuery.startsWith('?');
		if (descriptorQuestionMark && !locationQuestionMark) {
			return false;
		}
	}

	let locationParams = parseQuery(locationQuery);
	let descriptorParams = parseQuery(descriptorQuery);

	for (let [key, value] of descriptorParams) {
		if (value == undefined) {
			// ?a
			if (strict) {
				let locationParam = locationParams.find(param => param[0] === key);
				if (locationParam == undefined) {
					return false;
				}
			}
		} else if (value === '') {
			// ?a=
			let locationParam = locationParams.find(param => param[0] === key);
			if (locationParam == undefined) {
				return false;
			}

			let locationValue = locationParam[1];
			if (strict && locationValue == undefined) {
				return false;
			}
		} else {
			let locationParam = locationParams.find(param => param[0] === key && param[1] === value);
			if (locationParam == undefined) {
				return false;
			}
		}
	}

	return true;
}

// We do not use default URLSearchParams parsing for the descriptor
// as there is no difference between ?a and ?a=, but we need to be able to distinguish
export function parseQuery(query) {
	if (query === '') return [];

	let search = query.slice(1);
	let params = search.split('&');
	let matches = params.map(param => param.match(/([^=]*)(?:=(.*))?/));
	let matched = matches.filter(match => match);
	let results = matched.map(match => match.slice(1, 3));

	return results;
}
