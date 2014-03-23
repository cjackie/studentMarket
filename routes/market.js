/*
  handle ajax calls from market page
 */
//models
var Book = require('./models/Book');
var User = require('./models/User');
var books = new Book();
var users = new User();

/*
  return array of books based on search criteria(JSON)
 */
exports.getBooks = function(req, res){
    var id = req.session.userId;
    
    if (!id){
        res.redirect('/login');
        return;
    }

    if (!req.query.criteria){
        res.redirect('/error');
        return;
    }
    
    var criteria = req.query.criteria;
    books.searchBooks(criteria, function(err, data){
        if (err || !data){
            res.redirect('/error');
            return;
        }

        res.json(data);
    });
};

/*
  add the book id to user's card, return {success: yes or no}
 */
exports.addToCart = function(req, res){
    var id = req.session.userId;
    var bookId = req.query.bookId;

    if (!id){
        res.redirect('/login');
    }
    
    if (!bookId){
        res.redirect('/error');
        return;
    }

    users.findById(id, function(err, user){
        
        if (err || !user){
            res.redirect('/error');
            return;
        }
        
        user.cart.push(bookId);
        user.save(function(err){
            if (err){
                res.json({success:"no"});
            }
            res.json({success:"yes"});
        });
    });
};




