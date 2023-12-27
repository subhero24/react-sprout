export class RedirectError extends Error {
	constructor(message, to, status = 308) {
		super(message);
		this.to = to;
		this.status = status;
	}
}

export default function Redirect(props) {
	throw new RedirectError(props.message);
}
