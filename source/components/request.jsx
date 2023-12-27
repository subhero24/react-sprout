import { requestContext } from '../hooks/use-request.js';

export default function Request(props) {
	let { value, children } = props;

	return <requestContext.Provider value={value}>{children}</requestContext.Provider>;
}
