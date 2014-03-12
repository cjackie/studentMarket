/*
  this script provide data for ajax calls from myprogile page
 */
//models
var Book = require('./models/Book');
var User = require('./models/User');
var books = new Book();
var users = new User();


//ObjectId type
var ObjectId = User.ObjectId;

//helper functions
var helper = require('./helper/helperFunctions');



/*
  add a book to the user
  GET request, containing department, class, title, anthor and price
  special note on price: it's required to be filled out, so upon receiving
  undefined or NaN for price, store it -1 to db, indicate price is not specified
 */

exports.addBook = function(req, res){
    var id = req.session.userId;
    var type = req.query.type;
    var department = req.query.department;
    var classNum = req.query.classNum;
    var title = req.query.title;
    var author = req.query.author;
    var price = req.query.price;
    var bookId;
    
    var addBookId = function(err, user){
        if (err || !user){
            res.redirect('/error');
            return;
        }
        
        user.bookIds.push(bookId);
        user.save(function(err){
            if (err){

                res.redirect('/error');
                return;
            }
            
            newBook.ownerName = user.username;
            books.addBook(newBook, function(err){
                if (err){
                    res.redirect('/error');
                    return;
                } else {
                    res.send(JSON.stringify({success : 'yes'}));
                }   
            });        
        });

        //add book to DB
    };

    if (!id){
        res.redirect('/login');
        return;
    }
    
    if (!price){
        price = -1;
    } 

    //if there is one item missing. error
    if (!(department && classNum && title && author) || (type != "buy" && type != "sell")){
        res.redirect('/error');
        return;
    }

    //prepare data. add ownerName later
    bookId = new ObjectId();
    var newBook = {
        _id : bookId,
        type : type,
        department : department,
        classNum : classNum,
        title : title,
        author : author,
        price : price,
        createdDate : new Date(),
        ownerName : null
    };
    //update user book list
    users.findById(id, addBookId);
};

/*
  ajax for deleting a book
  book id is given
 */
exports.deleteBook = function(req, res){
    var bookId = req.query.bookId;
    var id = req.session.userId;
    
    if (!id){
        res.redirect('/login');
        return;
    }
    //delete the book from book database
    books.deleteById(bookId, function(err){
        if (err){
            res.redirect('/error');
            return;
        }
        //delete the book from the list
        users.findById(id, function(err, user){
            if (err || !user){
                res.redirect('/error');
                return;
            }

            if (bookId in user.bookIds){
                user.bookIds.splice(user.bookIds.indexOf(bookId), 1);
                
            }

            user.save(function(err){
                if (err){
                    res.redirect('/error');
                    return;
                }
                res.send(JSON.stringify({success : 'yes'}));
            });
        });
    });
};

/*
  change password, ajax call.
  receiving oldPassword, and newPassword.
 */
exports.changePassword = function(req, res){
    var id = req.session.userId;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;

    if (!id){
        res.redirect('/login');
        return;
    }

    users.findById(id, function(err, user){
        if (err || !user || user.password !== oldPassword){
            res.redirect('/error');
            return;
        }

        user.password = newPassword;
        user.save(function(err){
            if (err){
                res.redirect('/error');
                return;
            }  else {
                res.send(JSON.stringify({success : 'yes'}));
            }
        });        
    });
};

