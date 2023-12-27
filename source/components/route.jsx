import useRoot from '../hooks/use-root';

import { rootContext } from '../hooks/use-root.js';
import { baseContext } from '../hooks/use-base.js';
import { splatContext } from '../hooks/use-splat.js';
import { paramsContext } from '../hooks/use-params.js';

export default function Route(props) {
	let { config, base, rest, params, children } = props;
	let { type: Component, root } = config;

	let parentRoot = useRoot();
	let elementRoot = root ? base : parentRoot;

	// A component can always inspect the full url, so we pass the rest of the pathname as splat,
	// regardless wether a splat was used in the path descriptor of the route

	return (
		<rootContext.Provider value={elementRoot}>
			<baseContext.Provider value={base}>
				<paramsContext.Provider value={params}>
					<splatContext.Provider value={rest}>
						<Component>{children}</Component>
					</splatContext.Provider>
				</paramsContext.Provider>
			</baseContext.Provider>
		</rootContext.Provider>
	);
}
