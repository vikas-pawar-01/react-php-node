import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import './NewUser.css';

const NewUser = () => {

	const history = useHistory();

	const enteredName = useRef();
	const enteredEmail = useRef();
	const enteredPassword = useRef();

	const userSubmitHandler = async ( event ) => {
		event.preventDefault();

		try {
			const name = enteredName.current.value;
			const email = enteredEmail.current.value;
			const password = enteredPassword.current.value;

			if(name.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
				return false;
			}

			const formData = new FormData();
			formData.append( 'name', name );
			formData.append( 'email', email );
			formData.append( 'password', password );
			formData.append( '_method', 'POST' );

			await fetch( `${process.env.REACT_APP_PHP_BACKEND_URL}/user/`,
				{
					method: "POST",
					body:formData,
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
		history.push( '/users' );
	}

	return (
		<form className="user-form" onSubmit={userSubmitHandler}>
			<div>
				<label htmlFor="name">Name:</label>
				<input type="text" required id="name" name="name" ref={enteredName} />
			</div>
			<div>
				<label htmlFor="email">Email:</label>
				<input type="email" required id="email" name="email" ref={enteredEmail} />
			</div>
			<div>
				<label>Password:</label>
				<input type="password" required id="password" minLength={5} name="password" ref={enteredPassword} />
			</div>
			<div>
				<button type="submit" className="button green">Submit</button>
				<button type="reset" className="button red" onClick={handleCancel}>Cancel</button>
			</div>
		</form>
	);
};

export default NewUser;