import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Logout = (props) => {
	const history = useHistory();

	useEffect(() => {
		localStorage.removeItem('userData');
		props.onLogout();
		history.push( '/users' );
	}, [localStorage]);

	return (
		<p>User logged out!!</p>
	);
};

export default Logout;