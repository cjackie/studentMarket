$(document).ready(function(){
    var numAndLetters = /^[a-zA-Z]*\d*$/;
    var sbuEmail = /^\w+\.*\w+@stonybrook.edu$/;
                            
    $('.alert-danger').css({visibility : 'hidden'});
    
    var pass = false;
    $('#signup').submit(function(event){
        if (!pass){
            event.preventDefault();
        	
        	var error = '';
        	if (!numAndLetters.test($('#username').val())){
        	    error += 'username can only be letters and numbers<br>';
        	}
        	
        	if (!$('#email').val().match(sbuEmail)){
        	    error += "must be sbu email<br>";
        	}
        	
        	if ($('#password').val() !== $('#password2').val()){
        	    error += "passwords don't match<br>";
        	}
        	
        	if (error !== ''){
        	    $('#alert-text').html(error);
        	    $('.alert-danger').css({visibility : 'visible'});
        	} else {
        	    $.get('/testUsername', {'username' : $('#username').val()},
        	          function(data){
        	              if(data.availibility == 'no'){
        	                  $('#alert-text').html('name has been taken');
        	                  $('.alert-danger').css({visibility : 'visible'});
        	              } else {
                              //re submit the form
        	                  pass = true;
        	                  $('#submit').trigger($.Event("click"));
        	              }
        	          });
        	}
        }
    });
});
    
