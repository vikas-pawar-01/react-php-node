const express = require('express');
const app = express();
app.use(express.json());

const io = require("socket.io")( 5000, {
	cors: {
		origin: process.env.REACT_APP_FRONTEND_URL,
	},
});

io.on("connection", (socket) => {
	console.log("a user connected.");

	socket.on("sendNotification", (data) => {
		console.log("notification", data.notification);
		io.emit("broadcastNotification", { notification: data.notification });
	});

	socket.on("sendUserNotification", (data) => {
		console.log("sendUserNotification", data.notification);
		io.emit("broadcastUserNotification", { notification: data.notification, userId: data.userId });
	});
});