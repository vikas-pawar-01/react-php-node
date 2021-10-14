import { useHistory } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import './AddUserNotification.css';

import { io } from "socket.io-client";
import { AuthContext } from "../../context/auth-context";

const AddUseNotification = (props) => {
	const history = useHistory();
	const enteredNotification = useRef();
	const auth = useContext(AuthContext);

	const socket = useRef();
	useEffect(() => {
		socket.current = io(`${process.env.REACT_APP_NODE_BACKEND_URL}`);
	}, []);

	const userSubmitHandler = async ( event ) => {
		event.preventDefault();

		try {
			const notification = enteredNotification.current.value;

			if(notification.trim().length === 0 ) {
				return false;
			}

			const formData = new FormData();
			formData.append( 'name', notification );
			formData.append( 'user_id', auth.userId );
			formData.append( '_method', 'POST' );

			await fetch( `${process.env.REACT_APP_PHP_BACKEND_URL}/notification/`,
				{
					method: "POST",
					body:formData,
					headers: {}
				}
			);

			socket.current.emit('sendUserNotification', {notification: notification, userId: auth.userId});

			enteredNotification.current.value = '';

			props.onInsertNotification();
		} catch( err ) {
			console.log( err );
		}
	}

	return (
		<div className='notification-form'>
			<textarea id="name" name="name" ref={enteredNotification} />
			<button type="submit" className="button green" onClick={userSubmitHandler}>Submit</button>
		</div>
	);
};

export default AddUseNotification;