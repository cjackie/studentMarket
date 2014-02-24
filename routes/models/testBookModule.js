var Book = require('./Book.js');

var db = new Book();

var date1 = (new Date()) - 100;
var date2 = (new Date()) - 1000;
var date3 = (new Date()) - 10000;
var date4 = (new Date()) - 100000;

//show output
var print = function(err, data){    
    if (err){
        console.log(err);
    }

    if (data){
        console.log(data);
    }
};

//prepare some sample data
var book1 = {
    type : 'buy',
    department : 'AMS',
    classNum : '123',
    title : 'a good book',
    author : 'chaojie',
    price : -1,
    createdDate : date1,
    ownerName : 'Jack'
};

var book2 = {
    type : 'buy',
    department : 'ESE',
    classNum : '124',
    title : 'a good book2',
    author : 'chaojie',
    price : 1,
    createdDate : date2,
    ownerName : 'Jack'
};

var book3 = {
    type : 'buy',
    department : 'CSE',
    classNum : '125',
    title : 'a good book3',
    author : 'will',
    price : 55,
    createdDate : date3,
    ownerName : 'Jack'
};

var book4 = {
    type : 'sell',
    department : 'MAT',
    classNum : '123',
    title : 'a good book',
    author : 'chaojie',
    price : 2,
    createdDate : date4,
    ownerName : 'Jack'
};

//test addBook
db.addBook(book1, print);
db.addBook(book2, print);
db.addBook(book3, print);
db.addBook(book4, print);

//test findAll
db.findAll(print);

/*
  just realized it's kind of wasting time. I have faith it's working fine
  because these functions I have tested through command line.
  ok.. it's enought.
  :)
 */



