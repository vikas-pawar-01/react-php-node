import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/auth-context";

import UserNotifications from "./UserNotifications";

const UserDetails = () => {
	const auth = useContext(AuthContext);

	const [loadedUser, setLoadedUser] = useState();

	useEffect(() => {

		const fetchUser = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_PHP_BACKEND_URL}/user/${auth.userId}` );

				const responseData = await response.json();

				setLoadedUser(responseData[0]);
			} catch (err) {
				console.log(err);
			}
		}

		fetchUser();
	}, []);

	let content = <p>User not loaded.</p>;
	if(loadedUser) {
		content =
			<div>
				<h2>Id: #{loadedUser.id}</h2>
				<h3>Name: {loadedUser.name}</h3>
				<h4>Email: {loadedUser.email}</h4>
			</div>;
	}

	return (
		<div className='margin10'>
			<h2>UserDetails:</h2>
			{content}
			<UserNotifications />
		</div>

	);
};

export default UserDetails;