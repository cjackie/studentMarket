##A Website For Exchanging Books
<hr>
....Every beginning of semesters, students on campus are looking to buy textbooks. Some of them search online for best bargin, which is time
consuming. Some of them browse through facebook page, which is tedious and annoying. too much unorganized infromation. Or some of them go to
bookstore on campus, which , we all know, are super expensive. At the same time, they have their own books from previous semesters.
....So why not create a website, our own WEBSITE exclusive for SBU, to exchange books on campus. you can buy books from other students, and
sell your old textbooks easily.
<hr>
the design follows MVC design paradigm:
....*I use Jade, MongoDB and Express.<br>
....*app.js is the script that handle all url requests, then call corresponding modules.It's the Control.<br>
....*routes is the folder contains scripts that act as a middle person between Model, Control,and View. these scripts contain modules that
will be called in app.js, where they handle users requests and render views if necessary. it also has a models folder, which is the Model
where provide modules to interact with database.<br>
....*views is the folder contains views... obviously..<br>
....*public folder contains relevent CSS, Javascript, img, and so on, which support rendering of a view. there are exposed to clients.<br>
....*node_modules folder.. you can have to worry about it. it just contains all dependencies. for example express, mongodb, mongoose and jade.
