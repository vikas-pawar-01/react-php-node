import React, { Suspense, useEffect, useState } from 'react';

import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';

import { AuthContext } from './context/auth-context';
import Menu from './shared/components/Menu';
import './App.css';

const Users = React.lazy( () => import('./users/pages/Users') );
const NewUser = React.lazy( () => import('./users/pages/NewUser') );
const UpdateUser = React.lazy( () => import('./users/pages/UpdateUser') );
const AddNotification = React.lazy( () => import('./notification/pages/AddNotification') );
const Notifications = React.lazy( () => import('./notification/pages/Notifications') );
const Login = React.lazy( () => import('./auth/pages/Login' ) );
const Logout = React.lazy( () => import('./auth/pages/Logout' ) );
const UserDetails = React.lazy( () => import('./auth/pages/UserDetails' ) );

function App() {

	const [userId, setUserId] = useState();

	const loginHandler = (userId) => {
		setUserId(userId);
	}

	const logoutHandler = () => {
		setUserId(null);
	}

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));

		if( storedData && storedData.userId ) {
			setUserId(storedData.userId);
		}
	}, [localStorage]);

	let routes;
	if(userId) {
		routes = (
			<Switch>
				<Route path="/users/logout" exact>
					<Logout onLogout={logoutHandler} />
				</Route>
				<Route path="/users/details" exact>
					<UserDetails />
				</Route>

				<Redirect to="/users/details" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/users" exact>
					<Users />
				</Route>
				<Route path="/users/new" exact>
					<NewUser />
				</Route>
				<Route path="/users/login" exact>
					<Login onLogIn={loginHandler} />
				</Route>
				<Route path="/users/notifications/add" exact>
					<AddNotification />
				</Route>
				<Route path="/users/notifications" exact>
					<Notifications />
				</Route>
				<Route path="/users/:userId" exact>
					<UpdateUser />
				</Route>

				<Redirect to="/users" />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!userId,
				userId: userId
			}}
		>
			<Router>
				<main>
					<Suspense fallback={<div className="center">Loading...</div>}>
						<Menu />
						{routes}
					</Suspense>
				</main>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;
