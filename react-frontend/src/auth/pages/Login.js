import React, { useState, useRef, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from '../../context/auth-context';
import './Login.css'

const Login = (props) => {
	const auth = useContext(AuthContext);
	const history = useHistory();

	const [message, setMessage] = useState();

	const enteredEmail = useRef();
	const enteredPassword = useRef();

	const userLoginHandler = async ( event ) => {
		event.preventDefault();

		try {
			const email = enteredEmail.current.value;
			const password = enteredPassword.current.value;

			if(email.trim().length === 0 || password.trim().length === 0) {
				return false;
			}

			const formData = new FormData();
			formData.append( 'email', email );
			formData.append( 'password', password );
			formData.append( '_method', 'POST' );

			const response = await fetch( `${process.env.REACT_APP_PHP_BACKEND_URL}/auth`,
				{
					method: "POST",
					body:formData,
					headers: {}
				}
			);

			const responseData = await response.json();

			if(responseData.length === 0) {
				setMessage('Invalid credentials!');
			} else {
				localStorage.setItem(
					'userData',
					JSON.stringify({
						userId: responseData[0].id
					})
				);
				setMessage('Logged in successfully!');
				props.onLogIn(responseData[0].id);
				history.push( '/users/details' );
			}

		} catch( err ) {
			console.log( err );
		}
	}

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));

		if( storedData && storedData.userId ) {
			console.log('hereeee', storedData.userId)
			props.onLogIn(storedData.userId);
			history.push( '/users/details' );
		}
	}, [localStorage]);

	const handleCancel = (event) => {
		event.preventDefault();
		history.push( '/users/login' );
	}

	return (
		<form className="login-form" onSubmit={userLoginHandler}>
			<div>
				<h3>{message}</h3>
			</div>
			<div>
				<label htmlFor="email">Email:</label>
				<input type="email" id="email" required name="email" ref={enteredEmail} />
			</div>
			<div>
				<label>Password:</label>
				<input type="password" id="password" required name="password" ref={enteredPassword} />
			</div>
			<div>
				<button type="submit" className="button green">Login</button>
				<button type="reset" className="button red" onClick={handleCancel}>Cancel</button>
			</div>
		</form>
	);
};

export default Login;