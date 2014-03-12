var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.ObjectId;

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
    confirmationCode : String 
});


//sort users by name
userSchema.index({ username : 1});
userSchema.set('autoIndex', false);

var UserModel = mongoose.model('User', userSchema);

var User = function(){};

//export ObjectId
User.ObjectId = require('mongodb').ObjectID;

//find the user by id
User.prototype.findById = function(id, callback){
    UserModel.findById(id).exec(callback);
};

/*
  find by name.
 */
User.prototype.findByName = function(name, callback){
    UserModel.where('username').equals(name).findOne().exec(callback);
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
    user.save(callback);
};

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

//update notification of a user
User.prototype.updateNotification = function(id, newNotice, callback){
    UserModel.findById(id).update({notification : newNotice}, callback);
};

//activate or disactivate a user
User.prototype.updateStatus = function(id, status, callback){
    console.log(id + status);
    UserModel.where({_id : id}).update({$set : {activated : status}}, callback);
};

module.exports = User;


