
var Book = require('./Book');


var User = require('./User');

var user1 = {
    username : 'Jack',
    password : '123456',
    email : 'jack@gmail.com',
    bookIds : [],
    cart : [],
    notification : false,
    activated : false,
    confirmation : '123456'
};

var user2 = {
    username : 'Mike',
    password : '123456',
    email : 'Mike@gmail.com',
    bookIds : [],
    cart : [],
    notification : false,
    activated : false,
    confirmation : '3456'
};

exports.user1 = user1;
exports.user2 = user2;
exports.User = User;
exports.users = new User();
