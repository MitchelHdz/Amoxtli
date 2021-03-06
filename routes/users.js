module.exports = function(pool){
	var express = require('express');
	var router = express.Router();

	var getPostValues = function(req){
		var names = req.body.names;
			//Apellido paterno
		var last_names = req.body.last_names;
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		var re_password = req.body.re_password;
		values={
				names: names,
				last_names: last_names,
				username: username,
				email: email,
				password: password,
				re_password: re_password
		}
		return values;
	}

	var getPutValues = function(req){
		var names = req.body.names;
			//Apellido paterno
		var last_names = req.body.last_names;;
		var email = req.body.email;
		var password = req.body.password;
		var re_password = req.body.re_password;
		values={
			names: names,
			last_names: last_names,
			email: email,
			password: password
		}

		return values;
	}
	function getAllUsers(req, res){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('SELECT * FROM users',function(err, rows, fields){
					if(!err){
						users = rows;
						connection.release();
						res.render('users_all',{users: rows});
					}else{
						throw err;
						return false;
					}
				});
			}else{
				throw err;
				return false;
			}
		});
	}
	function getUserEdit(req, res){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('SELECT * FROM users WHERE id = "'+req.param("id")+'"',function(err, rows, fields){
					if(!err){
						connection.release();
						res.render('users_edit',{user: rows[0]});
						
					}else{
						res.render('error',{error: err});
						connection.release();
					}
				});
			}else{
				res.render('error',{error: err});
				connection.release();
			}
		});	
	}
	function getUser(req, res){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('SELECT * FROM users WHERE id = "'+req.param("id")+'"',function(err, rows, fields){
					if(!err){
						res.render('users_show',{user: rows[0]});
						connection.release();
					}else{
						res.render('error',{error: err});
						connection.release();
					}
				});
			}else{
				res.render('error',{error: err});
				connection.release();
			}
		});		
	}
	function postUser(values, res) {
		if(values.password == values.re_password){
			pool.getConnection(function(err, connection){
				if (!err) {
					delete values['re_password'];
					connection.query('INSERT INTO users SET ?', values, function(err, result){
						if(!err){
							res.redirect('/users/'+result.insertId);
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
	}
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
						res.render('error',{error: err});
						connection.release();
					}
				});
			}else{
				res.render('error',{error: err});
				connection.release();
			}
		});
	}
	function deleteUser(req, res, next){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('DELETE FROM users WHERE id = "'+req.param("id")+'"',function(err, result){
					if(!err){
						res.redirect('/users');
						connection.release();
					}else{
						res.render('users_new',{users: rows});
						connection.release();
					}
				});
			}else{
				res.render('error',{error: err});
				connection.release();
			}
		});		
	}
	function indexUser(id_user, res){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('SELECT * FROM users WHERE id = "'+id_user+'"',function(err, rows, fields){
					if(!err){
						res.render('users_main',{user: rows[0]});
						connection.release();
					}else{
						res.render('error',{error: err});
						connection.release();
					}
				});
			}else{
				res.render('error',{error: err});
				connection.release();
			}
		});			
	}	
	function getUserLendings(id_user, res){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('call getUserLendings('+id_user+')',function(err, rows, fields){
					if(!err){
						res.render('users_lendings',{lendings: rows[0]});
						connection.release();
					}else{
						res.render('error',{error: err});
						connection.release();
					}
				});
			}else{
				res.render('error',{error: err});
				connection.release();
			}
		});			
	}
	//Index de todos los usuarios//
	router.get('/', function(req, res, next) {
		getAllUsers(req, res);
	});
	router.get('/index', function(req, res, next){
		var id_user = req.session.user;
		if(id_user){
			indexUser(id_user, res);
		}else{
			res.redirect('/');
		}
	});
	router.get('/lendings', function(req, res, next){
		var id_user = req.session.user;
		if(id_user){
			getUserLendings(id_user, res);
		}else{
			res.redirect('/');
		}
	});
	//Template para registrar usuario/
	router.get('/new', function(req, res, next){
		res.render('users_new')
	});
	//Registro de ususaro//
	router.post('/', function(req, res, next){
		//Obteniendo los datos del formulario
		values = getPostValues(req);
		postUser(values, res);

	});
	router.get('/:id',function(req, res, next){
		getUser(req,res);
	});

	router.get('/:id/edit',function(req, res, next){
		getUserEdit(req, res);
	});

	router.put('/:id',function(req, res, next){
		putsUser(req, res, next)
	});
	router.post('/:id?', function(req, res, next){
		if(req.params.id){
			putsUser(req,res,next);
		}
	});
	router.delete('/:id?/delete', function(req, res, next){
		deleteUser(req, res, next);
	});
	router.post('/:id?/delete', function(req, res, next){
		deleteUser(req, res, next);
	});
	return router;
	router.get('/reports', function(req, res, next) {
	  res.render('users_reports', { session: req.session.user || req.session.admin });
	});
}


