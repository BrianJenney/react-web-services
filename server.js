const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const routes = require('./routes');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const uri = process.env.mongo;
const cors = require('cors');
require('dotenv').config();

const server = http.createServer(app);
const socket = socketIO(server);

mongoose.connect(uri);

const app = express();
app.use(cors());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 8081);

app.use(routes);

socket.on('connection', (socket) => {
	console.log(`User on socket ${socket}`);
});

socket.on('disconnect', () => {
	console.log('user disconnected');
});

module.exports = {
	socket
};
