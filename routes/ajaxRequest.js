


//models
var Book = require('./models/Book');
var User = require('./models/User');
var books = new Book();
var users = new User();

/*
  check if username has been register
 */

exports.testUsername = function(req, res){
    var username = req.query.username;
    
    if (!username){
        res.json({availibility: 'no'});
    }
    
    users.findByName(username, function(err, data){
        if (data){
            res.json({availibility: 'no'});
        } else {
            res.json({availibility: 'yes'});
        }
    });
};
