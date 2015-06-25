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

		}
	}

	return router;
}