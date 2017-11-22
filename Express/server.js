var express = require('express');
search = require('./search');
var app = express.createServer();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/search', function (req, res, next) {
    search(req.query.q, function (err, tweets) {
        // if (err) return next(err);
        console.log(tweets);
        res.render('search', {results: tweets, search: req.query.q})
    })
});
// app.put('/post/:name', function (req, res, next) {
// });
// app.post('/signup', function (req, res, next) {
// });
// app.del('/user/:id', function (req, res, next) {
// });
// app.patch('/user/:id', function (req, res, next) {
// });
// app.head('/user/:id', function (req, res, next) {
// });
app.listen(3000);