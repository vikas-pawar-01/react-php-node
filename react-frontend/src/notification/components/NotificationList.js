import React, { useContext } from 'react';
import NotificationItem from "./NotificationItem";

import './NotificationList.css';

const NotificationList = props => {

	if (props.items.length === 0) {
		return <></>;
	}

	return (
		<div>
			<ul className="us-notification">
				{props.items.map( ( notification, index ) => (
					<NotificationItem
					key={notification.id}
					id={notification.id}
					name={notification.name}
					userId={notification.user_id}
					userName={notification.user_name}
					className={ notification.user_id === null ? 'darker' : 'light'}
					/>
				))}
			</ul>
		</div>
	);
};

export default NotificationList;
