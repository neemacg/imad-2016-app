var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Database connection 

var pg = require('pg');
//var conString = "postgres://neemacg:db-neemacg-84054@localhost:5432/neemacg";
var conString = "postgres://localhost:5432/neemacg";

//var client = new pg.Client(conString);
//client.connect();


pg.connect(connectionString, onConnect);

function onConnect(err, client, done) {
  //Err - This means something went wrong connecting to the database.
  if (err) {
    console.error(err);
    process.exit(1);
  }

  //For now let's end client
  client.end();
}

// pg.connect(conString, (err, client, done) => {
//     // Handle connection errors
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
// }
// );


var articles={
    

 'article-one':{
    title:"Article one:Neema JInesh",
    heading:"Article One",
    date:"oct 1,2016",
    content:"Artvgfbghtgbhgbhgtbhg"
    
},
'article-two':{
    title:"Article two:Neema JInesh",
    heading:"Article two",
    date:"oct 2 ,2016",
    content:"Artvgfbghtgbhgbhgtbhgvvzsvsvsvsva`1111111111111114"
    
},
 'article-three':{
    titlxe:"Article three:Neema JInesh",
    heading:"Article threee",
    date:"oct 3,2016",
    content:"Artvgfbghtgbhgbhgtbh222222222222222g"
    
}

}
function createtemplate(data){
    var title=data.title;
    var heading=data.heading;
    var date=data.date;
    var content=data.content;
    var htmltemplate=`<html>
    <head>
        <title>
           ${title}
        </title>
        <meta name="vimport" content="width=device-width,initial-scale=1"/>
         <link href="/ui/style.css" rel="stylesheet" />
    
    </head>
    <body>
        <div class="container">
        <div>
            <a href="/">Home</a>
        </div>
        <hr/>
        <h3>
            ${heading}
        </h3>
        <div>
            oct 6 ,2016
        </div>
        <div>
            ${content}
        </div>
        </div>
    </body>
        
</html>`;
return htmltemplate;
}






app.get('/', function (req, res) {
    
    var pg = require('pg');
    //var conString = "postgres://neemacg:db-neemacg-84054@localhost:5432/neemacg";
    var conString = "postgres://localhost:5432/neemacg";
    
    //var client = new pg.Client(conString);
    //client.connect();
    
    
    pg.connect(connectionString, onConnect);
    
    function onConnect(err, client, done) {
      //Err - This means something went wrong connecting to the database.
      if (err) {
          res.send(err);
        console.error(err);
        process.exit(1);
      }
    
      //For now let's end client
      client.end();
    }
    
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'register.html'));
});

var counter=0;
app.get('/counter',function(req,res)
{
    counter=counter+1;
    res.send(counter.toString());
});

var names=[];
app.get('/submit-name',function(req,res)
{
    var name=req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});


app.get('/:articleName', function (req, res) {
    var articleName=req.params.articleName;
 res.send(createtemplate(articles[articleName]));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
})
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Post methods

app.post('/regSubmit',function(req,res){
    var name = req.body.user.name;
    var email = req.body.user.email;
    var password = req.body.user.password;
    client.query("INSERT INTO user(email,pwd,uname) values($1, $2)", [email,password,uname]);
    res.send(name + ' ' + email + ' ' + password+" inserted the row");
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
