$(document).ready(function(){

    //highlight market on menu bar
    $('#marketTag').addClass('active');

    
    //enable date range picker
    $('#date').daterangepicker(
        {
            ranges: {
                'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                'Last 7 Days': [moment().subtract('days', 6), moment()],
                'Last 30 Days': [moment().subtract('days', 29), moment()],
                'Since Last Month': [moment().subtract('month', 1).startOf('month'), moment()],
                'Since Last 3 Month' : [moment().subtract('month', 3).startOf('month'), moment()]
            },
            endDate: moment()
        },
        function(start, end){
            $('#date').attr('data-start', start);
            $('#date').attr('data-end', end);
        }
    );


    //add book to cart.
    $('#content').on('click', '.add', function(){
        var self = $(this);
        
        //ajax to add it to cart
        var bookId = self.attr('data-id');

        if (!bookId){
            //couldn't find id
            return;
        }

        $.get('/market/ajax/addToCart',
              {
                  'bookId' : bookId
              },
              function(data){
                  if (data || data.success === 'yes'){
                      self.children('span')
                          .removeClass('glyphicon-plus')
                          .addClass('glyphicon-ok')
                          .css({
                              'color':'green',
                              'cursor':'default'
                          });
                  }
              });
            

        
    });
    
    
    //build html to display books
    var constructTable = function(books){
        if (books.length !== 0){
            //head
            var html = '<div class="panel panel-primary">  <div class="panel-heading">Results</div>';
    
            //table head
            html += '<table class="table table-hover"><tr>  <th>Owner</th>  <th>Title</th>  <th>Author</th>  <th>Date</th> <th>Price</th>  <th>Add</th></tr>';
    
            books.forEach(function(book){
                var price;
                if (book.price == -1){
                    price = 'NA';
                } else {
                    price = book.price;
                }

                //format date
                var createdDate = moment(book.createdDate).format('MMMM Do YYYY');
                
                html += '<tr>  <td> '+ book.ownerName+'</td>  <td> '+book.title+' </td>  <td>'+book.author+'</td>  <td> '+createdDate+'</td> <td>'+price+' </td> <td>  <a class="add" href="javascript:void()" data-id='+book._id+'> <span style="color:#1E90FF;" class="glyphicon glyphicon-plus" ></span></a> </td></tr>';
            });
    
            //close tags
            html += '</table> </div>';
    
            //insert html
            $('#content').empty().append($(html));
        } else {
            
            //no result
            $('#content').empty();
        }
        
    };

    
    //form is submitted
    $('#form').submit(function(event){
        event.preventDefault();

        var type;
        if ($('#buy').hasClass('active')){
            type = 'buy';
        } else if ($('#sell').hasClass('active')){
            type = 'sell';
        }

        var department = $('#department').val();
        var classNum = $('#classNum').val();
        var createdDate = $('#date').attr('data-start');
        var endDate = $('#date').attr('data-end');

        //checking integrity of data
        if (!(department && classNum && createdDate && endDate)){
            $('#alert strong').html('Please complete them');
            $('#alert').slideDown();
            return;
        } else if (!type){
            $('#alert strong').html('Select Buy or Sell');
            $('#alert').slideDown();
            return;
        } else {
            $('#alert').css('display','none');
        }

        //makes department case-insensitive
        department = department.toUpperCase();
        
        //prepare data
        var criteria = {
            'type' : type,
            'department' : department,
            'classNum' : classNum,
            'createdDate' : createdDate,
            'endDate' : endDate
        };

        //ajax
        
        $.get('/market/ajax/getBooks',
              {
                  'criteria' : criteria
              },
              function(books){
                  constructTable(books);
              });
    });
});
