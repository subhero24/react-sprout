import { rootContext } from '../hooks/use-root.js';
import { matchContext } from '../hooks/use-match.js';
import { routeActionContext } from '../hooks/use-route-action.js';
import { routeLoaderContext } from '../hooks/use-route-loader.js';

import useRoot from '../hooks/use-root.js';
import usePageAction from '../hooks/use-page-action.js';
import usePageLoaders from '../hooks/use-page-loaders.js';
import useRouteAction from '../hooks/use-route-action.js';

export default function Route(props) {
	let { match, children } = props;
	let { type: Component, root } = match.config;

	let superRoot = useRoot();
	let routeRoot = root ? match.base : superRoot;

	let action = usePageAction();
	let loaders = usePageLoaders();

	let superAction = useRouteAction();
	let routeAction = action?.match.config === match.config ? action : superAction;
	let routeLoader = loaders.find(loader => loader.match.config === match.config);

	return (
		<matchContext.Provider value={match}>
			<rootContext.Provider value={routeRoot}>
				<routeActionContext.Provider value={routeAction}>
					<routeLoaderContext.Provider value={routeLoader}>
						<Component>{children}</Component>
					</routeLoaderContext.Provider>
				</routeActionContext.Provider>
			</rootContext.Provider>
		</matchContext.Provider>
	);
}
