module.exports = function(io, pool){
	var gravatar = require('gravatar');
	var express = require('express');
	var router = express.Router();
	var chat = io.on('connection', function (socket) {

		socket.on('load',function(data){

			var room = findClientsSocket(io,data);
			if(room.length === 0 ) {

				socket.emit('peopleinchat', {number: 0});
			}
			else if(room.length === 1) {

				socket.emit('peopleinchat', {
					number: 1,
					user: room[0].username,
					avatar: room[0].avatar,
					id: data
				});
			}
			else if(room.length >= 2) {

				chat.emit('tooMany', {boolean: true});
			}
		});

		// When the client emits 'login', save his name and avatar,
		// and add them to the room
		socket.on('login', function(data) {

			var room = findClientsSocket(io, data.id);
			// Only two people per room are allowed
			if (room.length < 2) {

				// Use the socket object to store data. Each client gets
				// their own unique socket object

				socket.username = data.user;
				socket.room = data.id;
				socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});

				// Tell the person what he should use for an avatar
				socket.emit('img', socket.avatar);


				// Add the client to the room
				socket.join(data.id);

				if (room.length == 1) {

					var usernames = [],
						avatars = [];

					usernames.push(room[0].username);
					usernames.push(socket.username);

					avatars.push(room[0].avatar);
					avatars.push(socket.avatar);

					// Send the startChat event to all the people in the
					// room, along with a list of people that are in it.

					chat.in(data.id).emit('startChat', {
						boolean: true,
						id: data.id,
						users: usernames,
						avatars: avatars
					});
				}
			}
			else {
				socket.emit('tooMany', {boolean: true});
			}
		});

		// Somebody left the chat
		socket.on('disconnect', function() {

			// Notify the other person in the chat room
			// that his partner has left

			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});

			// leave the room
			socket.leave(socket.room);
		});


		// Handle the sending of messages
		socket.on('msg', function(data){

			// When the server receives a message, it sends it to the other person in the room.
			socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
		});
	});

	function findClientsSocket(io,roomId, namespace) {
		var res = [],
			ns = io.of(namespace ||"/");    // the default namespace is "/"

		if (ns) {
			for (var id in ns.connected) {
				if(roomId) {
					var index = ns.connected[id].rooms.indexOf(roomId) ;
					if(index !== -1) {
						res.push(ns.connected[id]);
					}
				}
				else {
					res.push(ns.connected[id]);
				}
			}
		}
		return res;
	}	
	function getPostValues(req){
		var id = req.body.id;
		var user_id = req.body.id;

		var values = {
			id: id,
			user_id: user_id
		}

		return values;
	}

	function postChat(values, res) {
		pool.getConnection(function(err, connection){
			if (!err) {
				connection.query('INSERT INTO chats SET ?', values, function(err, result){
					if(!err){
						res.redirect('/chat/index');
						connection.release();
					}
					else{
						res.render('error',{error: err});
						connection.release();
					}
				});					
			}
			else{
				res.render('error',{error: err});
				connection.release();
			}
		});
	}

	function getChats(res) {
		pool.getConnection(function(err, connection){
			if (!err) {
				connection.query('SELECT * FROM chats', function(err, rows, fields){
					if(!err){
						res.render('/chat/index',{chats: rows});
						connection.release();
					}
					else{
						res.render('error',{error: err});
						connection.release();
					}
				});					
			}
			else{
				res.render('error',{error: err});
				connection.release();
			}
		});
	}	

	router.get('/', function(req, res){
		// Render views/home.html
		res.render('home');
	});

	router.get('/index', function(req, res){

	});

	router.get('/create', function(req,res){

		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		var values = {
			id: id,
			user_id: req.session.user
		}
		postChat(values, res);
		// Redirect to the random room
		res.redirect('/chat/'+id);
	});

	router.get('/:id', function(req,res){
		console.log('pene')
		// Render the chant.html view
		res.render('chat');
	});

	router.post('/', function(req, res){
		var values = getPostValues(req);
		postChat(values, res);
	});
	return router;
}

	