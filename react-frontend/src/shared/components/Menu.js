import { NavLink } from "react-router-dom";
import './Menu.css';
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const Menu = () => {

	const auth = useContext(AuthContext);

	return (
		<div className='ul-menu'>
			{!auth.isLoggedIn && (
				<div className='li-menu'>
					<NavLink exact activeClassName="active" to="/users"  >
						Users
					</NavLink>
				</div>
			)}

			{!auth.isLoggedIn && (

				<div className='li-menu'>
					<NavLink exact activeClassName="active" to="/users/new">
						Add User
					</NavLink>
				</div>
			)}

			{!auth.isLoggedIn && (
			<div className='li-menu'>
				<NavLink exact activeClassName="active" to="/users/notifications">
					Notifications
				</NavLink>
			</div>
			)}

			{!auth.isLoggedIn && (
				<div className='li-menu-right'>
					<NavLink exact activeClassName="active" to="/users/login">
						Log In
					</NavLink>
				</div>
			)}

			{auth.isLoggedIn && (
				<div className='li-menu'>
					<NavLink exact activeClassName="active" to="/users/details">
						User Details
					</NavLink>
				</div>
			)}

			{auth.isLoggedIn && (
			<div className='li-menu-right'>
				<NavLink exact activeClassName="active" to="/users/logout">
					Log Out
				</NavLink>
			</div>
			)}
		</div>
	);
};

export default Menu;