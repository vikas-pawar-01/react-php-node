import React, { useState, useEffect, useContext, useRef } from "react";

import NotificationList from "../components/NotificationList";
import AddNotification from "./AddNotification";
import { AuthContext } from "../../context/auth-context";
import './Notifications.css'

import { io } from "socket.io-client";

const Notifications = () => {

	const auth = useContext(AuthContext);
	const [notification, setNotification] = useState();
	const [loadedNotifications, setLoadedNotifications] = useState([]);
	const [isLoaded, setIsLoaded] = useState();

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
			socket.current.on( 'broadcastUserNotification', function( data ) {
				setNotification( { notification: data.notification, userId: data.userId } );
			} );
		}

		fetchData();
	}, []);

	let userNotitication;
	if(notification) {
		userNotitication =
			<div className='slideOut'>
					<h3>{notification.userId} :{notification.notification}</h3>
			</div>;
	}

	const insertNotificationHandler = () => {
		setIsLoaded( (prevState) => !prevState );
	}

	return (
		<React.Fragment>
			<div className="chatBoxTop">
				{userNotitication}
				<NotificationList items={loadedNotifications} />
			</div>
			<div className="chatBoxBottom">
				<AddNotification onInsertNotification={insertNotificationHandler} />
			</div>
		</React.Fragment>
	);
}

export default Notifications;