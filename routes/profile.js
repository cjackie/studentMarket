/*
  this script provide data for ajax calls from myprogile page
 */



/*
  add a book to the user
  GET request, containing department, class, title, anthor and price
  special note on price: it's required to be filled out, so upon receiving
  undefined or NaN for price, store it -1 to db, indicate price is not specified
 */

exports.addBook = function(req, res){
    var id = req.session.id;
    var type = req.query.type;
    var department = req.query.department;
    var classNum = req.query.classNum;
    var title = req.query.title;
    var author = req.query.author;
    var price = req.query.price;
    var bookId;
    var bookIds;
    var addBookId = function(err, user){
        if (err || !user){
            res.redirect('/error');
        }

        bookIds = user.bookIds + bookId;
        users.updateBooks(id, bookIds, function(err){
            if (err){
                res.redirect('/error');
            }
            res.send(JSON.stringify({success : 'yes'}));
        });
    };

    
    if (!id){
        res.redirect('login');
    }
    
    if (!price){
        price = -1;
    } 

    //if there is one item missing. error
    if (!(department && classNum && title && author) || (type != "buy" && type != "sell")){
        res.redirect('/error');
    }

    //prepare data
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
        ownerId : id
    }

    //add the book to DB
    books.addBook(newBook, function(err){
        if (err){
            res.redirect('error');
        }

        //update user book list
        users.findById(id, addBookId);
    });
};

/*
  ajax for deleting a book
  book id is given
 */
exports.deleteBook = function(req, res){
    var bookId = req.query.bookId;
    var id = req.session.id;

    if (!id){
        res.redirect('login');
    }
    
    //delete the book from book database
    books.deleteById(bookId, function(err){
        if (err){
            res.redirect('/error');
        }

        //delete the book from the list
        users.findById(id, function(err, data){
            if (err || !data){
                res.redirect('/error');
            }

            var bookIds = data.bookIds;
            if (bookId in bookIds){
                bookIds.splice(bookIds.indexOf(bookId), 1);
            }

            users.updateBooks(id, bookIds);
            res.send(JSON.stringify({success : 'yes'}));
        });
    });
};

/*
  change password, ajax call.
  receiving oldPassword, and newPassword.
 */
exports.changePassword = function(req, res){
    var id = req.session.id;
    var oldPassword = req.query.oldPassword;
    var newPassword = req.query.newPassword;

    if (!id){
        res.redirect('/login');
    }

    users.findById(id, function(err, data){
        if (err || !data || data.password !== oldPassword){
            res.redirect('/error');
        }

        users.updatePassword(id, newPassword, function(err){
            if (err){
                res.redirect('/error');
            } else {
                res.send(JSON.stringify({success : yes}));
            }
        });
    });
};

