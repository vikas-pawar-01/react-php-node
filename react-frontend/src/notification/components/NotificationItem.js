const NotificationItem = props => {
	return (
		<li className={`table-row ${props.className} li-height`}>
			<div className="col col-1"><b>{props.userName ? props.userName : 'Admin'}</b> {props.name}</div>
		</li>
	);
}

export default NotificationItem;
