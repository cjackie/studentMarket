var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/studentMarket', function(err){
    console.error('cannot connect to db');
});

var Schema = mongoose.Schema;

/*
  data structure of an user
 */
var userSchema = new Schema({
    username : String,
    password : String,
    email : String,
    bookIds : [ObjectId],
    cart : [ObjectId],
    notification : {type : Boolean, default : false},
    activated : Boolean,
    confirmationCode : String;
});


//sort users by name
userSchema.index({ username : 1});
userSchema.set('autoIndex', false);

var UserModel = mongoose.model('User', userSchema);

var User = {};

//find the user by id
User.prototype.findById = function(id, callback){
    UserModel.findById(id).exec(callback);
};

//find the user by name
User.prototype.findByName = function(name, callback){
    UserModel.where('username').equals(name).exec(callback);
};

/*
  add a new user
  @precondition:
    an object of user is past in and it's complete and good
  @newUser:
    an object that will be stored in database. it's complete and good
 */
User.prototype.addUser = function(newUser, callback){
    var user = new UserModel(newUser);
    user.save().exec(callback);
}

//update password
User.prototype.updatePassword = function(id, newPassword, callback){
    UserModel.findById(id).update({password : newPassword}, callback);
};

//update cart
User.prototype.updateCart = function(id, newCart, callback){
    UserModel.findById(id).update({cart : newCart}, callback);
};

//update book list
User.prototype.updateBooks = function(id, newBooks, callback){
    UserModel.findById(id).update({bookIds : newBooks}, callback);
};

//update cart of a user
User.prototype.updateCart = function(id, newCart, callback){
    UserModel.findById(id).update({cart : newCart}, callback);
};

//update notification of a user
User.prototype.updateNotification = function(id, newNotice, callback){
    UserModel.findById(id).update({notification : newNotice}, callback);
};

//activate or disactivate a user
User.prototype.updateStatus = function(id, status, callback){
    UserNodel.findById(id).update({activated : status}, callback);
};

module.exports = User;


