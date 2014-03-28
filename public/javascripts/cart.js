$(document).ready(function(){

    //highlight market on menu bar
    $('#cartTag').addClass('active');

    //delete a book from cart
    $('.remove').click(function(){
        var self = $(this);
        var rawId = self.attr('data-id');
        var id = rawId.substr(1, rawId.length-2);

        if (!id){
            return;
        }

        //remove
        $.get('/cart/ajax/deleteItem', 
              {
                  'bookId' : id
              },
              function(data){
                  if (data.success === 'yes'){
                      self.parent().parent().parent().css({'display':'none'});
                  }
              });
    });


    //submit the form
    $('#form').submit(function(event){
        event.preventDefault();
        

        var counter = 1;
        var progress;
        //make
        $('#body').slideUp(400,function(){
            $('.progress').show(400, function(){
                var bar = $('.progress-bar');
                var num;
                var width;

                progress = setInterval(function(){
                    //extract integer from percentage
                    width = bar.attr('data-num');
                    num = parseFloat(width);
                    num = num + (100 - num)*0.05;
                    bar.css({'width': String(num)+'%'});
                    bar.attr('data-num', num);
                }, 100);
                counter--;
            });
        });
        
        $.post('/cart/ajax/submit', {},
               function(data){
                   alert(data.success+counter);
                   if (counter === 0){
                       if (data.success === 'yes'){
                           clearInterval(progress);
                           $('.progress-bar').css({'width' : '100%'});
                           $('#final').show();
                           $('.text-danger').hide();
                       } else {
                           clearInterval(progress);
                           $('.progress-bar').css({'width' : '0%'});
                           $('#final').show();
                           $('.text-success').hide();
                       }
                   }
               });
    });
});
