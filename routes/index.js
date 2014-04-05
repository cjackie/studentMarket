
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
var helper = require('./helper/helperFunctions');
    
/*
  pages
*/
exports.index = function(req, res){
    books.getSome(5, function(err, _books){
        res.render('index', {books : _books});
    });
};

exports.signup = function(req, res){
    res.render('signup');
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
    var sbuEmail = /^\w+\.*\w+@stonybrook.edu$/;
    var confirmationCode = Math.random()*10000000000000000 + '';
    
    var register = function(err, data){
        if (data) {
            //name has been taken
            res.redirect('/error');
            return;
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
                text : 'activate you account by click http://studentmarket.herokuapp.com/confirmation/' + confirmationCode + '/' + username
            }, function(){
                res.render('register');
            });
        }
    }


    //checking
    if (username && email && password && password2){
        if (username.match(numAndLetters) && email.match(sbuEmail)){
            if(password == password2){
                //add a new user
                users.findByName(username, register);
            } else {
                res.redirect('/error');
            }
        }
        else{
            res.redirect('/error');
        }
    } else {
        res.redirect('/error');
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
    var sequence = req.param('activateSequence');
    var username = req.param('username');
    
    var activateCB = function(err, user){
        if (err || !user){
            res.redirect('/error');
            return;
        }
        if (user.confirmationCode == sequence){
            user.activated = true;
            user.save(function(err){
                if (err){
                    res.redirect('/error');
                }
            });
            res.render('confirmation');
            
        } else {
            res.redirect('/error');
            return
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

    if (!username || !password){
        res.redirect('/error');
    }
    
    users.findByName(username, function(err, user){
        if (err || !user){
            res.json({success : 'no'});
            return;
        }
        if (user.password == password && user.activated){
            req.session.userId = user._id;
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
    var id = req.session.userId;
    var bookIds;

    var render = function(err, user){
        if (err || !user){
            res.redirect('/error');
            return;
        }
        bookIds = user.bookIds;
        if (bookIds.length > 0){
            var localBooks = [];
            var counter = 0;
            for (var i = 0; i < bookIds.length; i++){
                counter++;
                books.findById(bookIds[i], function(err, book){
                    if (!err && book){
                        localBooks.push(book);
                    }
                    counter--;
                    if (counter === 0){
                        res.render('profile', {
                            user : user,
                            books : localBooks,
                            jsFiles : ['profile.js']
                        });
                    }
                });
            }
        } else {
            res.render('profile',{
                user : user,
                books : [],
                jsFiles : ['profile.js']
            });
        }
    }

    
    if (!id){
        res.redirect('/login');
        return;
    } else {
        users.findById(id, render);
    }
};

/*
  render market page.
  return cart number
 */
exports.market = function(req, res){
    var id = req.session.userId;
    if (!id){
        res.redirect('/login');
        return;
    }

    users.findById(id, function(err, user){
        if (err || !user){
            res.redirect('/error');
            return;
        }

        res.render('market', {
            cartNum : user.cart.length,
            jsFiles : ['lib/moment.min.js', 'lib/daterangepicker.js', 'market.js'],
            cssFiles : ['lib/daterangepicker-bs3.css']
        });
    });
};

/*
  display cart
  return books that are in the cart
 */
exports.cart = function(req, res){
    var id = req.session.userId;

    if (!id){
        res.redirect('/login');
        return;
    }

    users.findById(id, function(err, user){
        if (err || !user){
            res.redirect('/error');
            return;
        }
        
        books.findBooks(user.cart, function(err, booksInCart){
            if (!booksInCart || err){
                res.redirect('/error');
                return;
            }

            res.render('cart',
                       {
                           books:booksInCart,
                           jsFiles : ['cart.js']
                       });
        });
    });
};


/*
  log out. destroy session
 */
exports.logout = function(req, res){
    var id = req.session.userId;

    if (!id){
        res.redirect('login');
        return;
    }

    req.session.destroy();
    res.render('logout');
};

/*
  error page
 */
exports.error = function(req, res){
    res.render('error');
};

/*
  about page
 */
exports.about = function(req, res){
    res.render('about',{
        jsFiles : ['about.js']
    });
};
