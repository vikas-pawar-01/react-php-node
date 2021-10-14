import React, { useState, useEffect, useContext, useRef } from "react";

import { AuthContext } from "../../context/auth-context";
import AddUserNotification from "./AddUserNotification";
import UserNotificationList from "../components/UserNotificationList";

import { io } from "socket.io-client";

const UserNotifications = () => {

	const auth = useContext(AuthContext);
	const [loadedNotifications, setLoadedNotifications] = useState([]);
	const [isLoaded, setIsLoaded] = useState();
	const [notification, setNotification] = useState();

	const socket = useRef();
	useEffect(() => {
		socket.current = io(`${process.env.REACT_APP_NODE_BACKEND_URL}`);
	}, []);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_PHP_BACKEND_URL}/notification/` );

				const responseData = await response.json();

				setLoadedNotifications(responseData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchNotifications();
	}, [isLoaded, notification]);

	useEffect(() => {

		const fetchData = async() => {
			socket.current.on( 'broadcastNotification', function( data ) {
				setNotification( data.notification );
			} );
		}

		fetchData();
	}, []);

	const insertNotificationHandler = () => {
		setIsLoaded( (prevState) => !prevState );
	}

	let userNotitication;
	if(notification) {
		userNotitication =
			<div id='animation' className='slideOut'>
				<h3>Admin : {notification}</h3>
			</div>;
	}

	return (
		<React.Fragment>
			<div className="chatBoxTop">
				{userNotitication}
				<UserNotificationList items={loadedNotifications} />
			</div>
			<div className="chatBoxBottom">
				<AddUserNotification onInsertNotification={insertNotificationHandler} />
			</div>
		</React.Fragment>
	);
}

export default UserNotifications;