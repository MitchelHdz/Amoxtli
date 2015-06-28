module.exports = function(pool){
	var express = require('express');
	var router = express.Router();

	function getPostValues(req){
		var body = req.body;
		var date = new Date();

		var user_id = req.session.user;
		var book_id = body.book_id;
		var lending_date = date.getDate();
		var delivery_date = (date.getDate() + 6);

		var values = {
			user_id: user_id,
			book_id: book_id,
			lending_date: lending_date,
			delivery_date: delivery_date
		};

		return values;
	}


	router.post('/', function(req, res, next) {
		nigger
	})
	return router;
}