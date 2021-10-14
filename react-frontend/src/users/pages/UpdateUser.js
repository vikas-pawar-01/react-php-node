import React, { useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import './NewUser.css';

const UpdateUser = () => {

	const history = useHistory();

	const enteredName = useRef();
	const enteredEmail = useRef();

	const userId = useParams().userId;

	useEffect(() => {

		const fetchUser = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_PHP_BACKEND_URL}/user/${userId}` );

				const responseData = await response.json();

				enteredName.current.value = responseData[0].name;
				enteredEmail.current.value = responseData[0].email;
			} catch (err) {
				console.log(err);
			}
		}

		fetchUser();
	}, [userId]);

	const userUpdateHandler = async ( event ) => {
		event.preventDefault();

		try {
			const name = enteredName.current.value;
			const email = enteredEmail.current.value;

			if(name.trim().length === 0 || email.trim().length === 0 ) {
				return false;
			}

			const formData = new FormData();
			formData.append( 'name', name );
			formData.append( 'email', email );
			formData.append( '_method', 'PUT' );

			await fetch( `${process.env.REACT_APP_PHP_BACKEND_URL}/user/${userId}`,
				{
					method: "POST",
					body: formData,
					headers: {}
				}
			);

			history.push( '/users' );
		} catch( err ) {
			console.log( err );
		}
	}

	const handleCancel = (event) => {
		event.preventDefault();
		history.push( '/' );
	}

	return (
		<form className="user-form" onSubmit={userUpdateHandler}>
			<div>
				<label htmlFor="name">Name:</label>
				<input type="text" required id="name" name="name" ref={enteredName} />
			</div>
			<div>
				<label htmlFor="email">Email:</label>
				<input type="email" required id="email" name="email" ref={enteredEmail} />
			</div>
			<div>
				<button type="submit" className="button green">Update</button>
				<button type="reset" className="button red" onClick={handleCancel}>Cancel</button>
			</div>
		</form>
	);
};

export default UpdateUser;