module.exports = function(pool){
	var express = require('express');
	var router = express.Router();

	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('search_book', { session: req.session.user || req.session.admin });
	});
	router.get('/login', function(req, res, next){
		res.render('login', { title: 'Amoxtli'});
	});
	router.get('/loginAdmin', function(req, res, next){
		res.render('login_admin');
	});

	router.use(function(req, res, next){
		var path = req._parsedUrl.pathname;
		if(path == '/' || path == '/books/search' || path == '/books/searching' || /\/books\/.+/.test(path)){
			next();
		}
		else{
			if(req.session.admin || req.session.user){
				next();
			}
			else{
				res.redirect('/');
			}
		}
	});
	router.get('/index', function(req, res, next) {
	  res.render('users_ind', { title: 'Amoxtli' });
	});
	router.get('/reports', function(req, res, next) {
	  res.render('report', { title: 'Reportes', 'lendings':
		[
			{ 'id_user': '1', 'id_book': '1', 'date': 'hoy'},
			{ 'id_user': '2', 'id_book': '2', 'date': 'mañana'}
		]});
	});
	router.get('/lendings', function(req, res, next) {
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('call getLendings()', function(err, rows, fields){
					if(!err){
						console.log(rows);
						res.render('lending', { title: 'Prestamos' ,	'lendings': rows[0]});
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
	});
	router.get('/editions', function(req, res, next) {
	  res.render('edit', { title: 'Ediciones' });
	});
	router.get('/confirm_report', function(req, res, next) {
	  res.render('confirm_reports', { title: 'Confirmacion' });
	});
	router.get('/confirm_lending', function(req, res, next) {
	  res.render('confirm_lendings', { title: 'Confirmacion' });
	});

	return router;
}