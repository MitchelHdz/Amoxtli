var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Amoxtli' });
});
router.get('/index', function(req, res, next) {
  res.render('users_ind', { title: 'Amoxtli' });
});
router.get('/reports', function(req, res, next) {
  res.render('report', { title: 'Reportes' });
});
router.get('/lendings', function(req, res, next) {
  res.render('lending', { title: 'Prestamos' });
});
router.get('/editions', function(req, res, next) {
  res.render('edit', { title: 'Ediciones' });
});

module.exports = router;
