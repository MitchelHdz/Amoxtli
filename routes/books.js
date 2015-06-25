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
	function postBook(res, values){
		pool.getConnection(function(err, connection){
			if(!err){
				connection.query('INSERT INTO books SET ?', values, function(err, result){
					if(!err){
						res.redirect('/editions', {flash: 'Registro exitoso'});
					}else{
						res.render('error',{error: err})
					}
				});
			}else{
				res.render('error',{error: err})
			}
		});
	}

	router.get('/new',function(req, res, next){
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
	return router;
}