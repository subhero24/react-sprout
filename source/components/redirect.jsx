export default function Redirect(props) {
	throw Response.redirect(props.to, props.status);
}
