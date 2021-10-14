import React from 'react';
import { Link, useHistory } from "react-router-dom";

const UserItem = props => {

	const history = useHistory();

	const userDeleteHandler = async() => {
		try {
			const formData = new FormData();
			formData.append( '_method', 'DELETE' );

			await fetch( `${process.env.REACT_APP_PHP_BACKEND_URL}/user/${props.id}`,
				{
					method: "POST",
					body: formData,
					headers: {}
				}
			);

			history.push( '/' );
		} catch( err ) {
			console.log( err );
		}
	}

	return (
		<li className="table-row">
			<div className="col col-1">{props.name}</div>
			<div className="col col-2">{props.email}</div>
			<div className="col col-3">
				<Link to={`/users/${props.id}`} className="button green">Edit</Link>
				<button className="button red" onClick={userDeleteHandler}>Delete</button>
			</div>
		</li>
	);
}

export default UserItem;
