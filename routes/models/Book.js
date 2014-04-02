var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/studentMarket', function(err){
    if (err){
        console.error('error occured when connecting to db');
    }
}); 

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.ObjectId;
/*
  data structure of a book
 */
var bookSchema = new Schema({
    department : String,
    classNum : String,
    title : String,
    author : String,
    price : Number,
    createdDate : {type : Date, default : Date.now()},
    ownerName : String
});

//sort the books by date. reverse order, which means from latest to oldest
bookSchema.index({ createdDate : 1});
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
    BookModel.find({}).sort({createdDate : -1}).limit(num).exec(callback);
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
    var criteriaRefine = {};
    //if get rid of undefine element, or give a default value
    if (criteria.department) criteriaRefine.department = criteria.department;
    if (criteria.classNum) criteriaRefine.classNum = criteria.classNum;
    
    //default is one year ago
    if (!criteria.createdDate){
        criteria.createdDate = new Date() - 31556952000;
        criteria.endDate = new Date();
    }

    console.log(criteriaRefine);
    BookModel.where(criteriaRefine)
      .where('createdDate')
      .gt(criteria.createdDate)
      .lt(criteria.endDate)
      .exec(callback);
};

//find books by id, return an array of books
Book.prototype.findBooks = function(bookIds, callback){
    BookModel.find({'_id' : { $in : bookIds }}, callback);
};

//export module
module.exports = Book;    
                                 






                             



    
