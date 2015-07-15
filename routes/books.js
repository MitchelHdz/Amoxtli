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
						connection.release();
					}
				});
			}else{
				res.render('error',{error: err});
				connection.release();
			}
		});	
	}
	function postBook(res, values){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('INSERT INTO books SET ?', values, function(err, result){
					if(!err){
						res.redirect('/books/new');
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
	function editBook(res, id){
		pool.getConnection(function(err, connection){
			if (!err){
				connection.query('SELECT * FROM books WHERE id = "'+id+'"',function(err, rows, fields){
					if(!err){
						console.log(rows);
						res.render('edit_book',{book: rows[0]});
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
	function putBook(res, values, id){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('UPDATE books SET ? WHERE ?', [values, id], function(err, result){
					if(!err){
						res.redirect('/books/'+id);
						connection.release();
					}else{
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
	function searchBooks (res, q) {
			var query = [
				{author: q},
				{name: q},
				{editor: q},
			]
			pool.getConnection(function(err, connection){
			if(!err){
				connection.query('SELECT * FROM books WHERE ? OR ? OR ?', query, function(err, rows, fields){
					if(!err){
						if(rows.length >0){
							res.render('books_query', {books: rows});
							connection.release();
						}
						else{
							res.render('books_query', {books: null});
							connection.release();
						}
					}else{
						res.render('error',{error: err})
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
	function deleteBook(res, id){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('DELETE FROM books WHERE id = "'+id+'"', function(err, result){
					if(!err){
						res.redirect('/books/new');
						connection.release();
					}else{
						res.render('error',{error: err})
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
	router.get('/searching', function(req, res, next){
		res.render('search_book', { session: req.session.user || req.session.admin });
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
	});	router.post('/:id?', function(req, res, next){
		var values = getPutValues(req);
		var id = req.params.id;
		putBook(res, values, id);
	});
	router.get('/edit', function(req, res, next){
		var sess = req.session;
		if(sess.admin){
			var id = req.query.id;
			console.log(id);
			editBook(res, id);
		}else{
			res.redirect('/');
		}
	});
	router.post('/:id?/delete', function(req, res, next){
		var id = req.params.id;
		deleteBook(res, id);
	});
	router.get('/date',function(req, res, next){
		var date = new Date();
		date.setDate(date.getDate() + 6);
		console.log(date);
		res.end(toString(date.getDate()));
	});
	router.get('/:id',function(req, res, next){
		getBook(req,res);
	});
	router.post('/:id?', function(req, res, next){
		var values = getPutValues(req);
		var id = req.params.id;
		putBook(res, values, id);
	});
	return router;
}