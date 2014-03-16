$(document).ready(function(){
    var numAndLetters = /^[a-zA-Z]*\d*$/;
    $('#login').submit(function(event){
        event.preventDefault();
        var error = '';
        
        if (!numAndLetters.test($('#username').val())){
            error += 'invalid username';
            $('#alert-text').html(error);
            $('.alert-danger').css({visibility : 'visible'});
        } else {
            var password = $('#password').val();
            var username = $('#username').val();
            $.post('/login2', {'password' : password,
                               'username' : username},
                   function(data){
                       if (data.success.toLowerCase() == 'no'){
                           error += 'incorrect password or username';
                           $('#alert-text').html(error);
                           $('.alert-danger').css({visibility : 'visible'});
                       } else {
                           location = '/myprofile';
                           return;
                       }
                   });
        }
    });
});


