/*
  handle ajax calls from market page
 */


//models
var Book = require('./models/Book');
var User = require('./models/User');
var books = new Book();
var users = new User();

/*
  return array of books based on search criteria
 */
exports.getBooks = function(req, res){
    var id = req.session.id;
    var criteria = req.query.criteria;
    
    if (!id){
        res.redirect('/login');
    }

    books.searchBooks(criteria, function(err, data){
        if (err || !data){
            res.redirect('/error');
        }

        res.send(JSON.stringify(data));
    });
};

/*
  add the book id to user's card, return {success: yes or no}
 */
exports.addToCart = function(req, res){
    var id = req.session.id;
    var bookId = req.query.bookId;

    if (!id || !bookId){
        res.redirect('/error');
    }

    users.findById(id, function(err, user){
        if (err || !user){
           res.redirect('/error');
        }

        user.cart.push(bookId);
        users.updateCart(id, user.cart, function(err){
            if (err){
                res.send(JSON.stringify({success:"no"}));
            }
            res.send(JSON.stringify({success:"yes"}));
        });
    });
};




