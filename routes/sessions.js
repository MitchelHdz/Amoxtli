module.exports = function(pool){
	var express = require('express');
	var router = express.Router();

	function getLoginParams(req){
		var username = req.body.username;
		var password = req.body.password;

		var login_params = {
			'username': username,
			'password': password
		};
		console.log(login_params);
		return login_params;
	}
	function loginAdmin(req, res, login_params){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('SELECT * FROM admins WHERE username="'+login_params.username+'"', function(err, rows, fields){
					if(!err){
						admin = rows[0];
						if(admin){
							if(admin.password == login_params.password){
								var sess = req.session;
								sess.admin = admin.username;
								res.redirect('/index')
							}else{
								res.writeHead(500, "Bad-Bassword", {'Content-Type': 'text/html'});
								res.end('Contraseña incorrecta');
							}
						}else{
							res.writeHead(500, "No-User", {'Content-Type': 'text/html'});
							res.end('No existe este usuario');
						}
					}else{
						throw err;
					}
				});
			}else{
				throw err;
			}
		});
	}
	function loginUsers(req, res, login_params){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('SELECT * FROM users WHERE username="'+login_params.username+'"', function(err, rows, fields){
					if(!err){
						user = rows[0];
						if(user){
							if(user.password == login_params.password){
								var sess = req.session;
								sess.user = user.username;
								res.redirect('/index')
							}else{
								res.writeHead(500, "Bad-Bassword", {'Content-Type': 'text/html'});
								res.end('Contraseña incorrecta');
							}
						}else{
							res.writeHead(500, "No-User", {'Content-Type': 'text/html'});
							res.end('No existe este usuario');
						}
					}else{
						throw err;
					}
				});
			}else{
				throw err;
			}
		});
	}
	router.post('/loginAdmin', function(req, res, next){
		var login_params = getLoginParams(req);
		if ((login_params.username) && (login_params.password)){
			loginUsers(req, res, login_params);
		}else{
			res.writeHead(500, "No-Field Type", {'Content-Type': 'text/html'});
			res.end('Aprende a llenar formularios mongoloide.');
		}
	});
	router.post('/login', function(req, res, next){
		var login_params = getLoginParams(req);
		if ((login_params.username) && (login_params.password)){
			loginUsers(req, res, login_params);
		}else{
			res.writeHead(500, "No-Field Type", {'Content-Type': 'text/html'});
			res.end('Aprende a llenar formularios mongoloide.');
		}

	});
	router.get('/logout',function(req, res, next){
		req.session.destroy();
		res.redirect('/');
	});
	return router;
}