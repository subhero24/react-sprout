import { useMemo } from 'react';
import { nativeDocument } from '../utilities/document.js';

import useResolve from '../hooks/use-resolve.js';
import useLocation, { locationContext } from '../hooks/use-location.js';

export default function Location(props) {
	let { url, children } = props;

	let resolve = useResolve();
	let location = useLocation();
	let locationContextValue = useMemo(() => {
		if (url instanceof URL) return url;
		if (url === nativeDocument?.location) return url;

		try {
			return new URL(url);
		} catch {
			if (location) {
				try {
					new URL(url, location);
				} catch {
					throw new Error(`Invalid location url "${url}".`);
				}

				return new URL(resolve(url), location.origin);
			} else {
				throw new Error(
					`Invalid location url "${url}". There is no context available to support paths without an origin. Please specify the full URL.`,
				);
			}
		}
	}, [url, location, resolve]);

	return <locationContext.Provider value={locationContextValue}>{children}</locationContext.Provider>;
}
