export function pathParts(path = '') {
	let match = `${path}`.match(/([^?#]*)(\?[^#]*)?(#.*)?/);
	if (match == undefined) {
		throw new Error(`Could not parse url ${path}`);
	}

	let pathname = match[1];
	let search = match[2] ?? '';
	let hash = match[3] ?? '';

	return [pathname, search, hash];
}

export function resolvePaths(...paths) {
	if (paths.length === 0) return;

	let segments = [];
	let pathname, search, hash;

	let pathnameLeadingSlash;
	let pathnameTrailingSlash = true;

	for (let path of paths) {
		if (path == undefined) continue;

		[pathname, search, hash] = pathParts(path);

		pathnameLeadingSlash = pathname.startsWith('/');
		pathnameTrailingSlash = pathname.endsWith('/');

		if (pathnameLeadingSlash) {
			segments = [];
			pathname = pathname.slice(1);
		}

		if (pathnameTrailingSlash) {
			pathname = pathname.slice(0, pathname.length - 1);
		}

		if (pathname.length) {
			for (let segment of pathname.split('/')) {
				if (segment === '.') {
					continue;
				} else if (segment === '..') {
					segments.pop();
				} else {
					segments.push(segment);
				}
			}
		}
	}

	return '/' + segments.join('/') + (segments.length && pathnameTrailingSlash ? '/' : '') + search + hash;
}

export function joinPaths(...paths) {
	let [result, ...parts] = paths;

	for (let part of parts) {
		let endsWithSlash = result.endsWith('/');
		if (endsWithSlash) {
			result = result.slice(0, -1);
		}

		let startsWithSlash = part.startsWith('/');
		if (startsWithSlash) {
			part = part.slice(1);
		}

		result = result + '/' + part;
	}

	return result;
}
