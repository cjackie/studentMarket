var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/studentMarket', function(err){
    console.error('cannot connect to db');
}); 

//use for debug
var errorDisplay = console.error;

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.ObjectId;
/*
  data structure of a book
 */
var bookSchema = new Schema({
    type : String,
    department : String,
    classNum : String,
    title : String,
    author : String,
    price : Number,
    createdDate : {type : Date, default : Date.now()},
    ownerName : String
});

//sort the books by date. reverse order, which means from latest to oldest
bookSchema.index({ createdDate : -1});
//for better performance
bookSchema.set('autoIndex', false);

/*
  models
 */
var BookModel = mongoose.model('Book', bookSchema);

/*
  Book class, which provides functions to access, modify, update bookModel.
 */
var Book = function(){};

//find all books
Book.prototype.findAll = function(callback){
    BookModel.find({}).exec(callback);
};

//find a book by id
Book.prototype.findById = function(id, callback){
    BookModel.findById(id).exec(callback);
};

//get most recent books. number of book is specified by @num
Book.prototype.getSome = function(num, callback){
    BookModel.find({}).limit(num).exec(callback);
};


//delete by a book by id
Book.prototype.deleteById = function(id, callback){
    BookModel.findById(id).remove(callback);
};

//add a new book. assume data is good and complete
Book.prototype.addBook = function(newBook, callback){
    theBook = new BookModel(newBook);
    theBook.save(callback);
};

//search books based on criteria, assuming data is good and complete
Book.prototype.searchBooks = function(criteria, callback){
    BookModel.where({
        type : criteria.type,
        department : cirteria.department,
        classNum : criteria.classNum
    }).where('createdDate')
      .gt(criteria.createdDate)
      .exec(callback);
};

//export module
module.exports = Book;    
                                 






                             



    
