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
        //remove previous content
        $('#content').empty();
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
            $('#content').append($(html));
        } else {
            
            //no result
            var html = '<h2 class="text-info" style="margin:auto"> no book was found</h2>';
            $('#content').append(html);
        }
        
    };

    
    //form is submitted
    $('#form').submit(function(event){
        event.preventDefault();
        
        var department = $('#department').val();
        var classNum = $('#classNum').val();
        var range = $('#date').val();
        var createdDate, endDate;
        if (range){
            if (!range.match(/^\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}$/)){
                $('#alert strong').html('date has wrong format');
                $('#alert').slideDown();
                return;
            } else {
                createdDate = moment(range.split('-')[0], 'MM/DD/YYYY') + 0;
                endDate = moment(range.split('-')[1], 'MM/DD/YYYY') + 0;
            }
        }


        //checking integrity of data
        if (!department){ 
            $('#alert strong').html('Complete deparment');
            $('#alert').slideDown();
            return;
        } else {
            $('#alert').css('display','none');
        }

        //makes department case-insensitive
        department = department.toUpperCase();
        
        //prepare data
        var criteria = {
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
