module.exports = function(pool){
	var express = require('express');
	var router = express.Router();
	var shoutError = function(err){
		res.writeHead(500, "Internal Server Error", {'Content-Type': 'text/html'});
		res.end('Hubo un error por que la cago el Mitchel<br>Este es el pinche error: '+err);
	};
	var getPostValues = function(req){
		var names = req.body.names;
			//Apellido paterno
		var first_ln = req.body.first_ln;
			//Apellido materno
		var second_ln = req.body.second_ln;
		var username = req.body.username;
		var email = req.body.email;
		var facebook_id = req.body.facebook_id;
		var password = req.body.password;
		var re_password = req.body.re_password;
		values={
				names: names,
				first_ln: first_ln,
				second_ln: second_ln,
				username: username,
				email: email,
				facebook_id: facebook_id,
				password: password
		}

		return values;
	}
	var getPutValues = function(req){
		var names = req.body.names;
			//Apellido paterno
		var first_ln = req.body.first_ln;
			//Apellido materno
		var second_ln = req.body.second_ln;
		var username = req.body.username;
		var email = req.body.email;
		var facebook_id = req.body.facebook_id;
		var password = req.body.password;
		var re_password = req.body.re_password;
		values={
			names: names,
			first_ln: first_ln,
			second_ln: second_ln,
			username: username,
			email: email,
			facebook_id: facebook_id,
			password: password
		}

		return values;
	}

	//Index de todos los usuarios//
	router.get('/', function(req, res, next) {
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('SELECT * FROM users',function(err, rows, fields){
					if(!err){
						res.render('users_index',{users: rows});
						connection.release();
					}else{
						shoutError(err);
					}
				});
			}else{
				shoutError(err);
			}
		});
	});

	//Template para registrar usuario/
	router.get('/new', function(req, res, next){
		res.render('users_new')
	});
	//Registro de ususaro//
	router.post('/', function(req, res, next){
			//Obteniendo los datos del usuario
		values = getPostValues(req);
		if(values.password == values.re_password){
			pool.getConnection(function(err, connection){
				if (!err) {
					connection.query('INSERT INTO users SET ?', values, function(err, result){
						if(!err){
							res.writeHead(200, "OK", {'Content-Type': 'text/html'});
							res.end('Pinche si inserte todos los datos en el culo de tu jefa');
							connection.release();
						}
						else{
							shoutError(err);
						}
					});					
				}
				else{
					shoutError(err);
				}
			});
		}
	});

	//Template para vel el perfil del usuario//
	router.get('/:id',function(req, res, next){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('SELECT * FROM users WHERE id = "'+req.param("id")+'"',function(err, rows, fields){
					if(!err){
						res.render('users_show',{user: rows[0]});
						connection.release();
					}else{
						shoutError(err);
					}
				});
			}else{
				shoutError(err);
			}
		});
	});

	//Cambios en el perfil del usuario//
	function putsUser(req,res,next){

		values = getPutValues(req);
		id = {id: req.param("id")};

		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('UPDATE users SET ? WHERE ?', [values, id], function(err, result){
					if(!err){
						console.log(result);
						res.redirect('/users/'+req.param("id"));
						connection.release();
					}else{
						shoutError(err);
					}
				});
			}else{
				shoutError(err);
			}
		});
	}
	router.get('/:id/edit',function(req, res, next){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('SELECT * FROM users WHERE id = "'+req.param("id")+'"',function(err, rows, fields){
					if(!err){
						res.render('users_edit',{user: rows[0]});
						connection.release();
					}else{
						shoutError(err);
					}
				});
			}else{
				shoutError(err);
			}
		});		
	});
	router.put('/:id',function(req, res, next){
		putsUser(req, res, next)
	});
	router.post('/:id?', function(req, res, next){
		if(req.params.id){
			putsUser(req,res,next);
		}
	});

	//Eliminar el usuario//
	function deleteUser(req, res, next){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('DELETE FROM users WHERE id = "'+req.param("id")+'"',function(err, result){
					if(!err){
						res.redirect('/users');
						connection.release();
					}else{
						shoutError(err);
					}
				});
			}else{
				shoutError(err);
			}
		});		
	}
	router.delete('/:id/delete', function(req, res, next){
		deleteUser(req, res, next)
	});
	router.post('/:id?/delete', function(req, res, next){
		deleteUser(req, res, next)
	});
	return router;
}


