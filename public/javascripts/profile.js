
$(document).ready(function(){

    //active the profile tag
    $('#profileTag').addClass('active');
    
    //send ajax request to delete a book
    $('.deleteBook').click(function(){
        var book = $(this);
        //get rid of quotation marks
        var rawBookId = book.attr('data-bookId');
        var bookId = rawBookId.substr(1, rawBookId.length-2);
        book.parent().parent().css({'display' : 'none'});
        $.get('/myprofile/ajax/deleteBook',
              {'bookId' : bookId},
              function(data){
                  if (data){
                      book.parent().parent().css({'display' : 'none'});
                  } else {
                      alert('unexpected error!?');
                  }
              });
    });

    //add a new row of inputs
    $('#addRow').click(function(){
        var form = $('#addBooks');
        var newNum = parseInt(form.attr('data-num'))+1;
        form.attr('data-num', newNum);
        
        //construct html to insert
        var html =' <div id="lastRow" class="row"> <div class="col-md-2"> <label for="department'+newNum+'" class="sr-only"></label> <input id="department'+newNum+'" type="text" placeholder="e.g. ESE" class="form-control"/> </div> <div class="col-md-2 form-group"> <label for="classNum'+newNum+'" class="sr-only"></label> <input id="classNum'+newNum+'" type="text" placeholder="e.g. 124" class="form-control"/> </div> <div class="col-md-4 form-group"> <label for="title'+newNum+'" class="sr-only"></label> <input id="title'+newNum+'" type="text" placeholder="e.g. introduction to computer engineering" class="form-control"/> </div> <div class="col-md-2 form-group"> <label for="author'+newNum+'" class="sr-only"></label> <input id="author'+newNum+'" type="text" placeholder="e.g. Paul Scherz" class="form-control"/> </div> <div class="col-md-2 form-group"> <label for="price'+newNum+'" class="sr-only"></label> <input id="price'+newNum+'" type="text" class="form-control"/> </div> </div>' ;
        
        //insert after last node
        var lastRow = $('#lastRow');
        lastRow.attr('id', '');
        lastRow.after($(html));
    });
        
    //add a new book
    $('#addBooks').submit(function(event){
        event.preventDefault();
        
        var length = $('#addBooks').attr('data-num');
        var books = [];
        for (var i = 1; i <= length; i++){
            var department = $('#department'+i).val().toUpperCase();
            var classNum = $('#classNum'+i).val();
            var title = $('#title'+i).val();
            var author = $('#author'+i).val();
            var price = parseInt($('#price'+i).val());

            if (!price){
                price = -1;
            }
            
            if (!(department  && classNum && title && author)){
                $('#addBookAlert strong').html('Not complete');
                $('#addBookAlert').css({'visibility' : 'visible'});
                return;
            }

            books.push({
                'department' : department,
                'classNum' : classNum,
                'title' : title,
                'author' : author,
                'price' : price,
            });
        }

        //check type
        var typeDiv = $('#type');
        var type;
        if (typeDiv.children().eq(0).hasClass('active')){
            type = typeDiv.children().eq(0).attr('id');
        } else if (typeDiv.children().eq(1).hasClass('active')){
            type = typeDiv.children().eq(1).attr('id');
        } else {
            $('#addBookAlert strong').html('please indicate you want to buy books or sell books.');
            $('#addBookAlert').css({'visibility' : 'visible'});
            return;
        }


        //add every book
        var counter = 0;
        books.forEach(function(book){
            //ajax call
            counter++;
            $.get('myprofile/ajax/addBook',
                  {
                      'department' : book.department,
                      'classNum' : book.classNum,
                      'title' : book.title,
                      'author' : book.author,
                      'price' : book.price,
                      'type' : type
                  }, function(data){
                      counter--;
                      if (data.success != 'yes'){
                          alert('failed... unexpected.');
                      }
                      if (counter === 0){
                          //successfully add books, refresh the page
                          location = '/myprofile';
                      }
                  });
        });
            
    });
    
    //change password
    $('#submitPassword').click(function(){

        var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var newPassword2 = $('#newPassword2').val();

        if (!(oldPassword && newPassword && newPassword2)){
            $('#changePasswordAlert strong').html('Not complete!');
            $('#changePasswordAlert').css({'display':'block'});
            return;
        }

        if (newPassword !== newPassword2){
            $('#changePasswordAlert strong').html('New password does not match.');
            $('#changePasswordAlert').css({'display': 'block'});
            return;
        }

        //ajax to change password
        $.post('/myprofile/ajax/changePassword',
               {
                   'oldPassword' : oldPassword,
                   'newPassword' : newPassword
               },
               function(data){
                   if (data.success !== 'yes'){
                       if (data.success === 'no1'){
                           $('#changePasswordAlert strong').html('Password is wrong.');
                           $('#changePasswordAlert').css({'display': 'block'});
                           return;
                       } else {
                           $('#changePasswordAlert strong').html('Unexpected error occured!');
                           $('#changePasswordAlert').css({'display': 'block'});
                           alert('sdf');
                           return;
                       }
                   } else {
                       $('#changeBody').css({'display' : 'none'});
                       $('#changePasswordAlert').css({'display': 'none'});
                       $('#successTag').css({'display' : 'block'});
                       return;
                   }
               });
    });

});
