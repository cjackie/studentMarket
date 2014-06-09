
$(document).ready(function(){
    //remember if the user has logged in
    var session = false;

    /*
      helper functions
     */
    function message(msg){
        $("msgMsg").html(msg);
        location = "#msg";
    }
    
    function profile(books, username){
        /*
          construct html and then append to relevent place. append, dont clear it.
         */
        if (username) $("#profileName").html(username);
        
        var html = "";
        for (var i = 0; i < books.length; i++){
            var price = (books[i].price === -1)? "NA" : books[i].price;
            
            html += "<div " + "data-id='"+books[i]._id+"' style='background-color:white;border:solid 0.1px;border-radius:3px;padding-top:10px'>";
            html += "<p> Title: " + books[i].title + "</p>";
            html += "<p> author: " + books[i].title + "</p>";
            html += "<p> department: " + books[i].department + "</p>";
            html += "<p> classNum : " + books[i].classNum + "</p>";
            html += "<p> price : " + price + "</p>";
            html += "<p> date : " + new Date(books[i].createdDate) + "</p>";
            html += "<a class='profileDelete' href='javascript:void'> deletet the book </a>";
            html += "</div>";
        }

        //append to profile page
        
        $("#profileBooks").append($(html));
      
        //enhance the page.
        $("#profile").page();
        location = "#profile";
    }

    function market(books){
        /*
          clear and then append
         */
        var content = $("#searchContent");
        content.html("");

        var html = "";
        for (var i = 0; i < books.length; i++){
            html += "<div style='background-color:white;border:solid 0.1px;border-radius:3px;padding-top:10px'>";
            html += "<p> Title: " + books[i].title + "</p>";
            html += "<p> author: " + books[i].title + "</p>";
            html += "<p> price : " + books[i].price + "</p>";
            html += "<p> date : " + new Date(books[i].createdDate) + "</p>";
            html += "<a class='marketAdd' "+"data-id='"+books[i]._id+"' href='javascript:void'> add the book </a>";
            html += "</div>";
        }

        content.html($(html));
        $("#market").page();
        location = "#market";
    }

    
    /*
      login page
     */
    $("#loginSubmit").click(function(){
        alert("hi");
        var username = $("#loginUsername").val();
        var password = $("#loginPassword").val();

        if (!username || !password){
            message("please complete them");
            return;
        }

        $.post("/mobile/login",
               {
                   "username" : username,
                   "password" : password
               },
               function(data){
                   if (data.success === "yes"){
                       session = true;
                       profile(data.books, data.username);
                   } else {
                       message("wrong password or username");
                   }
               });
    });
    
    /*
      profile page
     */
    $("#profileSubmit").click(function(){
        if (!session){
            location = "#home";
            return;
        }
        
        
        var department = $("#profileDepartment").val();
        var classNum = $("#profileClassNum").val();
        var title = $("#profileTitle").val();
        var author = $("#profileAuthor").val();
        var price = $("#profilePrice").val();

        if (!department || !classNum || !title || !author) {
            msg("please make sure to complete items with stars");
            return;
        }

        price = (!price)? -1 : price;
        
        $.get("/myprofile/ajax/addBook",
              {
                  "department" : book.department,
                  "classNum" : book.classNum,
                  "title" : book.title,
                  "author" : book.author,
                  "price" : book.price
              },
              function(data){
                 if (data.success === "yes") {
                     book = [{
                         "department" : book.department,
                         "classNum" : book.classNum,
                         "title" : book.title,
                         "author" : book.author,
                         "price" : book.price
                     }];
                     profile(book);
                 }
              });
    });


    /*
      delete a book in profile
     */
    $("#profile").on("click", ".profileDelete", function(){
        var self = $(this).parent();

        var id =self.attr("data-id");
        id = id.substr(1, id.length-2);

        $.get("/myprofile/ajax/deleteBook",
              {
                  "bookId" : id
              },
              function(data){
                  if (data) self.css({"dislay" : "none"});
              });
    });
                     

    /*
      market page
     */
    $("#marketSearch").click(function(){
        if (!session){
            location = "#home";
            return;
        }
        
        var department = $("#marketDepartment").val();
        var classNum = $("#marketClassNum").val();
        var dateCode = $("#marketDateRange").val();

        if (!department){
            message("department cannot be empty");
            return;
        }

        var date;
        //decode the date
        if (dateCode === "0")
            date = new Date() - 604800000;
        else if (dateCode === "1")
            date = new Date() - 2629740000;
        else if (dateCode === "2")
            date = new Date() - 7889220000;
        else
            date = new Date() - 31556880000;

        var criteria = {
            "department" : department,
            "classNum" : classNum,
            "createdDate" : date,
            "endDate" : new Date() + 86400000
        };

        $.get("/market/ajax/getBooks",
              {
                  "criteria" : criteria
              },
              function(books){
                  market(books);
              });
             
    });
                     
    /*
      market page, add a book
     */
    $("#searchContent").on("click", ".marketAdd", function(){
        var se = $(this);
        var id = self.attr("data-id");
        id = id.substr(1, id.length-2);

        $.get("/market/ajax/addToCart",
              {
                  "bookId" : id
              },
              function(data){
                  if (data.success === "yes"){
                      self.removeClass("marketAdd");
                      self.html("added!");
                  }
              });
    });

                     

    /*
      cart page
     */
    $(".changeToCart").click(function(){
        if (!session) {
            location = "#home";
            return;
        }

        //--!
        $.get("mobile/cartBooks", {},
              function(data){
                  var books = data.books;
                  var content = $("#cartBooks");
                  content.html("");
                  
                  var html = "";
                  for (var i = 0; i < books.length; i++){
                      var price = (books[i].price === -1)? "NA" : books[i].price;
                      
                      html += "<div style='background-color:white;border:solid 0.1px;border-radius:3px;padding-top:10px'>";
                      html += "<p> Owner: " + books[i].ownerName + "</p>";
                      html += "<p> Title: " + books[i].title + "</p>";
                      html += "<p> author: " + books[i].title + "</p>";
                      html += "<p> price : " + price + "</p>";
                      html += "</div>";
                  }
                  
                  content.html($(html));
                  $("#cart").page();
              });
    });


    /*
      submit the cart
     */
    $("#cartSubmit").click(function(){
        if (!session){
            location = "#home";
            return;
        }

        $.post("/cart/ajaxj/submit",
               {},
               function(data){
                   if (data.success === "yes")
                       message("email(s) have been sent");
                   else
                       message("something went wrong....");
               });
        
    });
    
});
