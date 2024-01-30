import { rootContext } from '../hooks/use-root.js';
import { matchContext } from '../hooks/use-match.js';
import { actionContext } from '../hooks/use-action.js';
import { loaderContext } from '../hooks/use-loader.js';

import useRoot from '../hooks/use-root.js';
import useAction from '../hooks/use-action.js';
import useLoaders from '../hooks/use-loaders.js';
import useActions from '../hooks/use-actions.js';

export default function Route(props) {
	let { match, children } = props;
	let { type: Component, root } = match.config;

	let superRoot = useRoot();
	let routeRoot = root ? match.base : superRoot;

	let actions = useActions();
	let loaders = useLoaders();

	let superAction = useAction();
	let routeAction = actions?.match.config === match.config ? actions : superAction;
	let routeLoader = loaders.find(loader => loader.match.config === match.config);

	// A component can always inspect the full url, so we pass the rest of the pathname as splat,
	// regardless wether a splat was used in the path descriptor of the route

	return (
		<matchContext.Provider value={match}>
			<rootContext.Provider value={routeRoot}>
				<actionContext.Provider value={routeAction}>
					<loaderContext.Provider value={routeLoader}>
						<Component>{children}</Component>
					</loaderContext.Provider>
				</actionContext.Provider>
			</rootContext.Provider>
		</matchContext.Provider>
	);
}
