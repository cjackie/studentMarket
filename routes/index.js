
/*
 * GET home page.
 */

//models
var Book = require('./models/Book');
var User = require('./models/User');
var books = new Book();
var users = new User();


//ObjectId type
var ObjectId = User.ObjectId;

//mailer
var mailer = require('./helper/mailer');

//helper functions
var helper = require('./helper/helperFuncitons');
    
/*
  pages
*/
exports.index = function(req, res){
    res.render('index');
};

exports.signup = function(req, res){
    res.render('singup');
};

exports.login = function(req, res){
    res.render('login');
};

/*
  from signup page. register a new account. 
  checking if every field is defined and correct
  if not correct redirect to error page.
  else just render the view register
 */
exports.register = function(req, res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var numAndLetters = /^[a-zA-Z]*\d*$/;
    var sbuEmail = /^\w+@stonybrook.edu$/;
    var confirmationCode = Math.random()*10000000000000000 + '';
    
    var register = function(err, data){
        if (data) {
            //name has been taken
            redirect('/error');
        } else {
            users.addUser({
                username : username,
                password : password,
                email : email,
                bookId : [],
                notification : false,
                cart : [],
                activated : false,
                confirmationCode : confirmationCode
            });
            mailer.sendMail({
                to : email,
                subject : 'Confirmation',
                text : 'activate you account by click http://localhost:3000/confirmation/' + confirmationCode + '/' + username
            }, function(){
                res.render('register');
            });
        }
    }

    //checking
    if (username && email && password && password2){
       if (username == typeof 'string' && email == typeof 'string'){
           if (username.match(numAndLetters) && email.match(sbuEmail)){
               if(password == password2){
                   //add a new user
                   users.findByName(username, register);
               }
           }
       }
    }
};

exports.infoDisplay = function(req, res){
    var text = req.query.message;
    res.render('infoboard', {message : text});
};

/*
  activate the user
 */
exports.confirm = function(req, res){
    var sequence = req.param.activatedSequence;
    var username = req.param.username;
    var activateCB = function(err, user){
        if (user.confirmationCode == sequence){
            users.updateStatus(user._id, true, function(err){
                if (err){
                    redirect('/error');
                } else {
                    res.render('confirmation');
                }
            });
        } else {
            redirect('/error');
        }
    };
   
    users.findByName(username, activateCB);
    
};

/*
  login and establish session by user's id
 */
exports.login2 = function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    users.findByName(username, function(err, user){
        if (user.password == password){
            req.session.id = user._id;
            res.json({success : 'yes'});
        } else {
            res.json({success : 'no'});
        }
    });
};

/*
  retrive user's data
 */
exports.profile = function(req, res){
    var id = req.session.id;
    var bookIds;
    var localBooks = [];

    var addBook = function(err, book){
        if (!err && book){
            localBooks.push(book);
        }
    };
    
    var render = function(err, user){
        if (err || !user){
            res.redirect('/error');
        }
        bookIds = user.bookIds;
        if (bookIds.length > 0){
            bookIds.foreach(function(id){
                books.findById(id, addBook);
            });
            res.render('profile',{
                user : user,
                books : localBooks
            });
        } else {
            res.render('profile',{
                user : user,
                books : []
            });
        }
    }

    
    if (!id){
        res.redirect('/login');
    } else {
        users.findById(id, render);
    }
};

/*
  render market page.
  return cart number
 */
exports.market = function(req, res){
    var id = req.session.id;

    if (!id){
        res.redirect('/login');
    }

    users.findById(id, function(err, user){
        if (err || !user){
            res.redirect('/error');
        }

        res.render('market', { cartNum : user.cart.lenght });
    });
};

/*
  display cart
  return books that are in the cart
 */
exports.cart = function(req, res){
    var id = req.session.id;

    if (!id){
        res.redirect('/login');
    }

    users.findById(id, function(err, user){
        if (err || !user){
            res.redirect('/error');
        }
        
        books.findBooks(user.cart, function(err, booksInCart){
            if (!booksInCart || err){
                res.redirect('/error');
            }

            res.render('cart', booksInCart);
        });
    });
};


/*
  log out. destroy session
 */
exports.logout = function(req, res){
    var id = req.session.id;

    if (!id){
        res.redirect('login');
    }

    req.session.destroy();
    res.render('logout');
};

