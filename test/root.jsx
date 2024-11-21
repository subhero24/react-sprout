import { createPortal } from 'react-dom';

const watchdog = createPortal(<div id="watchdog" />, document.body);

export default function Root(props) {
	return (
		<>
			{props.children}
			{watchdog}
		</>
	);
}
