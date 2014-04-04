var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/studentMarket';
var db = mongoose.connect(uristring, function(err){
    if (err){
        console.error('error occured when connecting to db');
    }
}); 
