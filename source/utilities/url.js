export function urlToPath(url) {
	return url.href.slice(url.origin.length);
}
