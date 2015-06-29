module.exports = function(pool){
	var express = require('express');
	var router = express.Router();
	var moment = require('moment');

	function getPostValues(req){
		var body = req.body;
		var date = new Date();

		var user_id = req.session.user;
		var book_id = body.book_id;
		var lending_date = moment(date.setDate(date.getDate())).format("YYYY-MM-DD HH:mm:ss");
		var delivery_date = moment(date.setDate(date.getDate() + 6)).format("YYYY-MM-DD HH:mm:ss");
		var values = {
			id_user: user_id,
			id_book: book_id,
			lending_date: lending_date,
			delivery_date: delivery_date
		};

		return values;
	}
	function postLending(res, values){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('INSERT INTO lendings SET ?', values, function(err, result){
					if(!err){
						res.redirect('/books/searching');
						connection.release();
					}else{
						res.render('error', {error: err});
						connection.release();
					}
				});
			}else{
				res.render('error', {error: err});
				connection.release();
			}
		});
	}
	function confirmLending(res, lending_id){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('call confirmLending('+lending_id+')', function(err, result){
					if(!err){
						res.render('confirm_lendings');
						connection.release();
					}else{
						res.render('error', {error: err});
						connection.release();		
					}			
				});
			}else{
				res.render('error', {error: err});
				connection.release();
			}
		});
	}
	function declineLending(res, lending_id){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('DELETE FROM lendings WHERE id = '+lending_id, function(err, result){
					if(!err){
						res.redirect('/lendings');
						connection.release();
					}else{
						res.render('error', {error: err});
						connection.release();		
					}			
				});
			}else{
				res.render('error', {error: err});
				connection.release();
			}
		})		
	}
	router.post('/', function(req, res, next) {
		var values = getPostValues(req);
		postLending(res, values);
	});
	router.post('/confirm', function(req, res, next){
		confirmLending(res, req.body.lending_id);
	});
	router.post('/decline', function(req, res, next){
		declineLending(res, req.body.lending_id);
	});
	return router;
}