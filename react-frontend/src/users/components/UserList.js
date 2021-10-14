import React from 'react';
import { Link } from 'react-router-dom';
import './UserList.css';
import UserItem from "./UserItem";

const UserList = props => {
	if (props.items.length === 0) {
		return (
			<div>
					<h2>No users found. Maybe create one?</h2>
			</div>
		);
	}

	return (
		<ul className="responsive-table">
			<li className="table-header" >
				<div className="col col-1">Name</div>
				<div className="col col-2">Email</div>
				<div className="col col-3">Action</div>
			</li>
			{props.items.map(user => (
				<UserItem
					key={user.id}
					id={user.id}
					name={user.name}
					email={user.email}
				/>
			))}
		</ul>
	);
};

export default UserList;
