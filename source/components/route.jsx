import useRoot from '../hooks/use-root.js';
import usePageAction from '../hooks/use-page-action.js';
import usePageLoaders from '../hooks/use-page-loaders.js';

import { baseContext } from '../hooks/use-base.js';
import { rootContext } from '../hooks/use-root.js';
import { routeActionContext } from '../hooks/use-route-action.js';
import { routeLoaderContext } from '../hooks/use-route-loader.js';
import { Fragment } from 'react';

export default function Route(props) {
	let { match, children } = props;
	let { type: Component, root } = match.config;

	let superRoot = useRoot();
	let routeRoot = root ? match.base : superRoot;

	let action = usePageAction();
	let loaders = usePageLoaders();

	let routeAction = action?.match.config === match.config ? action : undefined;
	let routeLoader = loaders.find(loader => loader.match.config === match.config);

	let base = match?.base ?? '/';
	let splat = match?.splat ?? match?.rest ?? [];
	let params = match?.params ?? {};

	let componentProps;
	if (Component !== Fragment) {
		componentProps = { params, splat };
	}

	return (
		<baseContext.Provider value={base}>
			<rootContext.Provider value={routeRoot}>
				<routeActionContext.Provider value={routeAction}>
					<routeLoaderContext.Provider value={routeLoader}>
						<Component {...componentProps}>{children}</Component>
					</routeLoaderContext.Provider>
				</routeActionContext.Provider>
			</rootContext.Provider>
		</baseContext.Provider>
	);
}
