import { rootContext } from '../hooks/use-root.js';
import { baseContext } from '../hooks/use-base.js';
import { splatContext } from '../hooks/use-splat.js';
import { paramsContext } from '../hooks/use-params.js';
import { actionContext } from '../hooks/use-action.js';
import { loaderContext } from '../hooks/use-loader.js';

import useRoot from '../hooks/use-root.js';
import useAction from '../hooks/use-action.js';
import useLoaders from '../hooks/use-loaders.js';
import useActions from '../hooks/use-actions.js';

export default function Route(props) {
	let { config, base, rest, params, children } = props;
	let { type: Component, root } = config;

	let superRoot = useRoot();
	let routeRoot = root ? base : superRoot;

	let actions = useActions();
	let loaders = useLoaders();

	let superAction = useAction();
	let routeAction = actions?.match.config === config ? actions : superAction;
	let routeLoader = loaders.find(loader => loader.match.config === config);

	// A component can always inspect the full url, so we pass the rest of the pathname as splat,
	// regardless wether a splat was used in the path descriptor of the route

	return (
		<rootContext.Provider value={routeRoot}>
			<baseContext.Provider value={base}>
				<paramsContext.Provider value={params}>
					<splatContext.Provider value={rest}>
						<actionContext.Provider value={routeAction}>
							<loaderContext.Provider value={routeLoader}>
								<Component>{children}</Component>
							</loaderContext.Provider>
						</actionContext.Provider>
					</splatContext.Provider>
				</paramsContext.Provider>
			</baseContext.Provider>
		</rootContext.Provider>
	);
}
