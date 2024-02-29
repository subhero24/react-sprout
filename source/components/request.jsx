import { useMemo } from 'react';
import { requestContext } from '../hooks/use-request.js';

export default function Request(props) {
	let { value, defaultValue, children } = props;

	let contextValue = useMemo(() => [value, defaultValue], [value, defaultValue]);

	return <requestContext.Provider value={contextValue}>{children}</requestContext.Provider>;
}
