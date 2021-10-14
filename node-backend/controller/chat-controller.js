const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const { createServer } = require('http');
const Server = require("socket.io");

const httpServer = createServer(app);

const getChat = async (req, res, next) => {
	const { notification } = req.body;

	const io = Server(httpServer, {
		cors: {
			origin: httpServer,
			methods: ["GET", "POST"],
			allowedHeaders: ["my-custom-header"],
			credentials: true
		}
	});

	io.on("connection", (socket) => {
		console.log('Server Connection..');
		console.log(socket.id);

		socket.emit("broadcast", { notification: "Hi, Good morning!!" } );
		// io.sockets.emit("room1", "roooom");
	});

	res.status(201).json({ notification: notification });
};

exports.getChat = getChat;