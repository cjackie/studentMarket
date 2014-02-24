
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//routes to handle ajax or other pages
var market = require('./routes/market');
var profile = require('./routes/profile');
var cart = require('./routes/cart');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/signup', routes.signup);
app.get('/login', routes.login);
app.post('/register', routes.register);
app.get('/infoboard', routes.infoDisplay);
app.get('/confirmation/:activateSequence/:username', routes.confirm);
app.post('/login2', routes.login2);
app.get('/myprofile', routes.profile);
app.get('/market', routes.market);
app.get('/cart', routes.cart);
app.get('/logout', routes.logout);

//ajax requests for myprofile page
app.get('/myprofile/ajax/addBook', profile.addBook);
app.get('/myprofile/ajax/deleteBook', profile.deleteBook);
app.post('/myprofile/ajax/changePassword', profile.changePassword);

//ajax requests for market page
app.get('/market/ajax/getBooks', market.getBooks);
app.get('/market/ajax/addToCard', market.addToCard);

//ajax requests for cart page
app.post("cart/ajax/submit", cart,submiet);



//when urls are not found
/* TODO */


app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
