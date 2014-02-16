##A Website For Exchanging Books

&nbsp;&nbsp;&nbsp;&nbsp;Every beginning of semesters, students on campus are looking to buy textbooks. Some of them search online for best bargin, which is time consuming. Some of them browse through facebook page, which is tedious and annoying. too much unorganized infromation. Or some of them go to bookstore on campus, which , we all know, are super expensive. At the same time, they have their own books from previous semesters.<br>
&nbsp;&nbsp;&nbsp;&nbsp;So why not create a website, our own WEBSITE exclusive for SBU, to exchange books on campus. You can buy books from other students, and sell your old textbooks easily.
<hr>
The design follows MVC design paradigm:<br>
&nbsp;&nbsp;&nbsp;&nbsp;I use Jade, MongoDB and Express.<br>
&nbsp;&nbsp;&nbsp;&nbsp;app.js is the script that handle all url requests, then call corresponding modules.It's the Control.<br>
&nbsp;&nbsp;&nbsp;&nbsp;routes is the folder contains scripts that act as a middleware between Model, Control,and View. These scripts contain modules that will be called in app.js, where they handle users requests and render views if necessary. It also has a models folder, which is the Model, where provide modules to interact with database.<br>
&nbsp;&nbsp;&nbsp;&nbsp;Views is the folder contains views... obviously..<br>
&nbsp;&nbsp;&nbsp;&nbsp;Public folder contains relevent CSS, Javascript, img, and so on, which support rendering of a view. They are exposed to clients.<br>
&nbsp;&nbsp;&nbsp;&nbsp;node_modules folder.. You can have to worry about it. It just contains all dependencies. For example express, mongodb, mongoose and jade.
&nbsp;&nbsp;&nbsp;&nbsp;The data folder is where database resides. we don't need to worry about it.
