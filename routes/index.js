var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Amoxtli' });
});
router.get('/login', function(req, res, next){
	res.render('login', { title: 'Amoxtli'});
});
router.get('/loginAdmin', function(req, res, next){
	res.render('login_admin');
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
  res.render('lending', { title: 'Prestamos' ,	'lendings':
	[
		{ 'id_user': '1', 'id_book': '1', 'date': 'hoy'},
		{ 'id_user': '2', 'id_book': '2', 'date': 'mañana'}
	]});
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
module.exports = router;
