import React, { useContext } from 'react';
import { AuthContext } from "../../context/auth-context";

const UserNotificationItem = props => {

	const { userId } = useContext(AuthContext);

	let content = '';
	if(userId === props.userId || props.userId === null ) {
		content = <li className={`table-row ${props.className} li-user-height-data`}>
			<div className="col col-1"><b>{props.userName ? props.userName : 'Admin'}</b> {props.name}</div>
		</li>
	}

	return content;
}

export default UserNotificationItem;
