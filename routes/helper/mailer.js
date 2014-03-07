/*
  provide a module to send emails to users
 */


var officialEmail = 'test123jack@gmail.com';
var emailPass = 'qq235689';
var transport = require('nodemailer').createTransport('SMTP', {
    service : 'Gmail',
    auth : {
        user : officialEmail,
        pass : emailPass
    }
});



/*
  mailer provide functions to upper layer
 */
var mailer = {
    /*
      data has properties subject, to, text.
     */
    sendMail: function(data, callback){
        var temp = {
            from : officialEmail,
            to : data.to,
            subject : data.subject,
            text : data.text
        };
        
        transport.sendMail(temp, callback);
    }
};


//export
module.exports = mailer;
