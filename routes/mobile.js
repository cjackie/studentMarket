/*
  mobile friendly web page
 */
var Book = require('./models/Book');
var User = require('./models/User');
var books = new Book();
var users = new User();

//ObjectId type
var ObjectId = User.ObjectId;

//mailer
var mailer = require('./helper/mailer');

//home page of mobile verison of the website
exports.mobile = function(req, res){
    res.render("mobile");
};

//login ajax
exports.login = function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password){
        res.redirect('/error');
        return;
    }
    
    users.findByName(username, function(err, user){
        if (err || !user){
            res.json({success : 'no'});
            return;
        }

        if (user.password == password && user.activated){
            req.session.userId = user._id;

            var data = {
                'username' : user.username,
                'books' : [],
                'success' : 'yes'
            };
            
            //retrive every book
            var bookIds = user.bookIds;
            var counter = 0;
            bookIds.forEach(elm, function(){
                counter++;
                books.findById(elm, function(err, book){
                    counter--;
                    if (!err) data.books.push(book);
                    if (counter === 0) res.json(data);
                });
            });

        } else {
            res.json({success : 'no'});
        }
    });
};


exports.cartBooks = function(req, res){
    var id = req.session.userId;
    if (!id){
        redirect('/login');
        return;
    }

    users.findById(id, function(err, user){
        if (err){
            redirect('/error');
            return;
        }

        var cart = user.cart;
        var data = {
            'books' : [],
            'success' : 'yes'
        };
        var counter = 0;
        cart.forEach(elm, function(){
            counter++;
            books.findById(elm, function(err, book){
                counter--;
                if (!err) data.books.push(book);
                if (counter === 0) res.json(data);
            });
        });
    });
};
