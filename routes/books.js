module.exports = function(pool){
	var express = require('express');
	var router = express.Router();

	function getPostValues(req){
		var body = req.body;

		var name = body.name;
		var author = body.author;
		var editor = body.editor;
		var genre = body.genre;
		var number = body.number;
		var review = body.review;

		var values = {
			name: name,
			author: author,
			editor: editor,
			genre: genre,
			number: number,
			review: review
		}

		return values;
	}
	function getPutValues(req){
		var body = req.body;

		var name = body.name;
		var author = body.author;
		var editor = body.editor;
		var genre = body.genre;
		var number = body.number;
		var review = body.review;

		var values = {
			name: name,
			author: author,
			editor: editor,
			genre: genre,
			number: number,
			review: review
		}
		console.log(values);
		return values;
	}
	function getBook(req, res){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('SELECT * FROM books WHERE id = "'+req.param("id")+'"',function(err, rows, fields){
					if(!err){
						var sess = req.session;
						res.render('books_show',{book: rows[0], session: sess.user});
						connection.release();
					}else{
						res.render('error',{error: err});
					}
				});
			}else{
				res.render('error',{error: err});
			}
		});	
	}
	function postBook(res, values){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('INSERT INTO books SET ?', values, function(err, result){
					if(!err){
						res.redirect('/books/new');
					}else{
						res.render('error',{error: err})
					}
				});
			}else{
				res.render('error',{error: err});
			}
		});
	}
	function putBook(res, values, id){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('UPDATE books SET ? WHERE ?', [values, id], function(err, result){
					if(!err){

					}else{
						res.render('error',{error: err})
					}
				});
			}
			else{
				res.render('error',{error: err})
			}
		});
	}
	function searchBooks (res, q) {
			var query = [
				{author: q},
				{name: q},
				{editor: q}
			]
			pool.getConnection(function(err, connection){
			if(!err){
				connection.query('SELECT * FROM books WHERE ? OR ? OR ?', query, function(err, rows, fields){
					if(!err){
						if(rows.length >0){
							res.render('books_query', {books: rows});
						}
						else{
							res.render('books_query', {books: null});
						}
					}else{
						res.render('error',{error: err})
					}
				});
			}
			else{
				res.render('error',{error: err});
			}
		});	
	}
	router.get('/searching', function(req, res, next){
		res.render('search_book');
	});
	router.get('/search', function(req, res, next){
		var q = req.query.q;;
		searchBooks(res, q);
	});
	router.get('/new', function(req, res, next){
		var sess = req.session;
		if(sess.admin){
			res.render('books_new');
		}else{
			res.redirect('/');
		}
	});
	router.post('/', function(req, res, next){
		values = getPostValues(req);
		postBook(res, values);
	});
	router.get('/:id',function(req, res, next){
		getBook(req,res);
	});
	router.get('/date',function(req, res, next){
		var date = new Date();
		date.setDate(date.getDate() + 6);
		console.log(date);
		res.end(toString(date.getDate()));
	});
	return router;
}