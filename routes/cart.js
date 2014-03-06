/*
  ajax for cart page
 */
//models

var mailer = require('./helper/mailer');
var Book = require('./models/Book');
var User = require('./models/User');
var books = new Book();
var users = new User();

/*
  delete a book from user's cart. return {success : yes or no}
 */
exports.deleteItem = function(req, res){
    var id = req.session.id
    var bookId = req.query.bookId;

    if (!id || !bookId){
        res.redirect('/login');
    }

    users.findById(id, function(err, user){
        if (err || !user){
            res.redirect('/error');
        }

        var newArr = [];
        var index = user.cart.indexOf(bookId);

        if (index < 0){
            res.send(JSON.stringify({success:'no'}));
        }

        newArr = user.cart.slice(0,index);
        newArr.push(user.cart.slice(index+1));

        users.updateCart(id, newArr, function(err){
            if (err){
                res.send(JSON.stringify({success:'no'}));
            }
            res.send(JSON.stringify({success:'yes'}));
        });
    });
};

/*
  notify owners of books that someone will buy or sell their books via
  email.
  return {success: yes or no}
 */
exports.submit = function(req, res){
    var id = req.session.id;
    var bookIds = req.body.bookIds;
    
    if (!id){
        res.redirect('/login');
    }

    var receivers = [];
 
    if (!Array.isArray(bookIds)){
        res.redirect('/error');
    }

    //make email content
    var makeText = function(username, email,bookNames,types){
        var text = username + ' wants your book, contact him: ' + email + '\n'
            + 'books requested:\n';
        for (var i = 0; i < types.length; i++){
            text += bookNames[i] + ' for' + types[i] + ' \n';
        }
        return text;
     
    };
    
    //called when the query is completed.
    var sendMails = function(receivers){
        var uniqueEmails = [];
        var uniqueReceivers = [];
        
        //ok, use for loop.. which I'm familliar with.
        for (var i = 0; i < receivers.length; i++){
            if (!receivers[i].email in uniqueEmails){
                uniqueReceivers[i].name = receivers[i].name;
                uniqueReceivers[i].email = receivers[i].email;
                uniqueReceivers[i].bookNames = [receivers[i].bookName];
                uniqueReceivers[i].types = [receivers[i].type];
                //update set of emails
                uniqueEmails.push(receivers[i].email);
            } else {
                //find the duplicate
                var j;
                for (j = 0; i < uniqueReceivers.length; i++){
                    if (uniqueReceivers[i].email==receivers[i].email){
                        uniqueReceivers[i].bookNames.push(receivers[i].bookName);
                        uniqueReceivers[i].types.push(receivers[i].type);
                        break;
                    }
                }
            }
        }
        //get sender
        users.findById(id, function(err, user){
            if (err || !user){
                res.redirect('/error');
            }
            //now no same emails being sent.
            for (var i = 0; i < uniqueReceivers; i++){
                var data = {};
                data.subject('Book request from a student');
                data.to(uniqueReceivers[i].email);
                for (var j = 0; j < uniqueReceivers[i].bookNames.length; j++){
                    data.text = makeText(user.username, user.email,
                             uniqueReceivers[i].bookNames,
                             uniqueReceivers[i].types);
                }
                mailer.sendMail(data);
            }
    };

    //query
    var counter = 0;
    bookIds.forEach(function(bookId, i){
        counter++;

        books.findById(bookId, function(err, book){
            if (err || !book){
                res.redirect('/error');
            }
            
            receivers[i].bookName = book.title;
            receivers[i].type = book.type;
           
            users.findById(book.ownerId, function(err, user){
                if (err || !user){
                    res.redirect('/error');
                }

                receivers[i].name = user.username;
                receivers[i].email = user.email;
                counter--;

                //prevent somehow indefinite loop
                if (counter > 30){
                    res.redirect('/error');
                }

                //for query is completed
                if (counter === 0){
                    sendMails(receivers);
                }
            });
        });
    });
};
                    

                    



            
