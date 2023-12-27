import { useCallback } from 'react';

import useBase from './use-base.js';
import useRoot from './use-root.js';
import useLocation from './use-location.js';

import { joinPaths, resolvePaths } from '../utilities/path.js';

export default function useResolve() {
	let root = useRoot();
	let base = useBase();
	let location = useLocation();

	return useCallback(
		(to = location, options = {}) => {
			try {
				return new URL(to).href;
			} catch {
				let absolute = to.startsWith('/');
				let relative = options.relative ?? true;
				let pathname = location?.pathname;

				if (absolute) {
					return joinPaths(root, to);
				} else if (relative) {
					return resolvePaths(base, to);
				} else if (pathname) {
					return resolvePaths(pathname, to);
				} else {
					throw new Error(`Could not resolve "${to}" without a location.`);
				}
			}
		},
		[root, base, location],
	);
}
