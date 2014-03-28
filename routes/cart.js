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
    var id = req.session.userId;
    var bookId = req.query.bookId;

    if (!id || !bookId){
        res.redirect('/login');
        return;
    }

    users.findById(id, function(err, user){
        if (err || !user){
            res.redirect('/error');
            return;
        }
        
        var index = user.cart.indexOf(bookId);
        if (index < 0){
            res.json({success:'no'});
            return;
        }

        user.cart.splice(index,1);
        user.save(function(err){
            if (err){
                res.json({success:'no'});
            } else {
                res.json({success:'yes'});
            }
        });
    });
};

/*
  notify owners of books that someone will buy or sell their books via
  email.
  return {success: yes or no}

  side note: messy.. one thing i learned from debugging this function was 
  that, sub function with a name like var func = function(){} has no access
  to 'parent' functions' variable. closure doesnt work in that case.

 */
exports.submit = function(req, res){
    var id = req.session.userId;

    if (!id){
        res.redirect('/login');
        return;
    }
    
    //called when the query is completed.
    var sendMails = function(receivers, user){

        if (receivers.length === 0){
            res.json({success:'no'});
            return;
        }

        var uniqueEmails = [];
        var uniqueReceivers = [];
        
        //ok, use for loop.. which I'm familliar with.
        for (var i = 0; i < receivers.length; i++){
            if (!(receivers[i].email in uniqueEmails)){
                uniqueReceivers[i] = {};
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
                    if (uniqueReceivers[j].email==receivers[i].email){
                        uniqueReceivers[j].bookNames.push(receivers[i].bookName);
                        uniqueReceivers[j].types.push(receivers[i].type);
                        break;
                    }
                }
            }
        }

        //make email content
        var makeText = function(username, email,bookNames,types){

            var text = '<html>' + username + ' wants your book, contact him: ' + email + '<br>' + 'books requested:<br>';
            for (var i = 0; i < types.length; i++){
                text += bookNames[i] + ' for' + types[i] + ' <br>';
            }
            return text+'</html>';
            
        };

        //now no same emails being sent.
        for (var i = 0; i < uniqueReceivers.length; i++){
            var data = {};
            data.subject = 'Book request from a student';
            data.to = uniqueReceivers[i].email;
            for (var j = 0; j < uniqueReceivers[i].bookNames.length; j++){
                data.text = makeText(user.username, user.email,
                                     uniqueReceivers[j].bookNames,
                                     uniqueReceivers[j].types);
            }
            
            mailer.sendMail(data, function(err){
                if (!err){
                    res.json({success:'yes'});
                } else {
                    res.json({success:'no'});
                }
            });
        }
    };

    //query
    users.findById(id, function(err, user){
        var bookIds = user.cart;

        var counter = 0;
        var receivers = [];
        var that = this;
        
        //checking if error occured
        var error = false;
        bookIds.forEach(function(bookId, i){

            counter++;

            //prevent somehow indefinite loop
            if (counter > 30){
                error = true;
                res.redirect('/error');
                return;
            }
            
            //lol... sigh
            if (error){
                return;
            }
            //index of books
            var pos = 0;
            books.findById(bookId, function(err, book){
                if (err || !book){
                    res.redirect('/error');
                    return;
                }
                
                //user has the book!!
                if (bookId in user.bookIds){
                    counter--;
                    return;
                }
                receivers[pos] = {};
                receivers[pos].bookName = book.title;
                receivers[pos].type = book.type;
                
                users.findByName(book.ownerName, function(err, owner){

                    if (err || !owner){
                        res.redirect('/error');
                        error = true;
                        return;
                    }

                    receivers[pos].name = owner.username;
                    receivers[pos].email = owner.email;

                    counter--;
                
                    //for query is completed
                    if (counter === 0){
                        user.cart = [];
                        user.save(); 
                        sendMails(receivers, user);
                    }
                })
            });
        });
    });
};
                    

                    



            
