import { useMemo } from 'react';

import { rootContext } from '../hooks/use-root.js';
import { baseContext } from '../hooks/use-base.js';
import { splatContext } from '../hooks/use-splat.js';
import { paramsContext } from '../hooks/use-params.js';
import { loaderContext } from '../hooks/use-loader.js';

import useRoot from '../hooks/use-root';
import useLoaders from '../hooks/use-loaders.js';

export default function Route(props) {
	let { config, base, rest, params, children } = props;
	let { type: Component, root } = config;

	let loaders = useLoaders();
	let parentRoot = useRoot();
	let elementRoot = root ? base : parentRoot;

	let loader = useMemo(() => loaders.find(loader => loader.match.config === config), [config, loaders]);

	// A component can always inspect the full url, so we pass the rest of the pathname as splat,
	// regardless wether a splat was used in the path descriptor of the route

	return (
		<rootContext.Provider value={elementRoot}>
			<baseContext.Provider value={base}>
				<paramsContext.Provider value={params}>
					<splatContext.Provider value={rest}>
						<loaderContext.Provider value={loader}>
							<Component>{children}</Component>
						</loaderContext.Provider>
					</splatContext.Provider>
				</paramsContext.Provider>
			</baseContext.Provider>
		</rootContext.Provider>
	);
}
