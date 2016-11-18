var express = require('express');
var morgan = require('morgan');
var path = require('path');
var fileUpload = require('express-fileupload');


var app = express();
app.use(morgan('combined'));


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// default options 
app.use(fileUpload()); 

// Database connection 

var pg = require('pg');

var config = {
  user: 'neemacg', //env var: PGUSER
  database: 'neemacg', //env var: PGDATABASE
  password: 'db-neemacg-84054', //env var: PGPASSWORD
  host: 'db.imad.hasura-app.io', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);



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
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'register.html'));
});

app.get('/addArticle', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'addArticle.html'));
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


/*app.get('/:articleName', function (req, res) {
    var articleName=req.params.articleName;
 res.send(createtemplate(articles[articleName]));
});*/


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

app.post('/regValidate',function(req,res){
    var name = req.body.user.name;
    var email = req.body.user.email;
    var password = req.body.user.password;
    
    // Validate the user
    res.setHeader('Content-Type', 'application/json');
    /*pool.query('INSERT INTO "user" (email,pwd,uname) values($1,$2,$3)',[email,password,name],function(err,result){
    	if(err) console.log(err);
    	
    	
    });*/
    res.send(JSON.stringify({ status: 'OK'}));
    
});



app.post('/regSubmit',function(req,res){
    var name = req.body.user.name;
    var email = req.body.user.email;
    var password = req.body.user.password;
    
    // Insert into the db
    res.setHeader('Content-Type', 'application/json');
    pool.query('INSERT INTO "user" (email,pwd,uname) values($1,$2,$3)',[email,password,name],function(err,result){
    	if(err) console.log(err);
    	
    	
    });
    //res.send(JSON.stringify({ status: 'OK'}));
    /*pool.connect(function(err, client, done) {
      if(err) {
           console.log(err);
        //return console.error('error fetching client from pool', err);
      }
      client.query('INSERT INTO user(email,pwd,uname) values($1,$2,$3)',[email,password,name],function(err,result){
          if(err){
              console.log(err);
          }
          else{
              console.log("Doneee");
          }
      });
    });*/
    
    
    res.redirect('/');
});

//Add article

app.post('/articleSubmit',function(req,res){
    
    var title = req.body.title;
    var content = req.body.content;

    articleImage = req.files.articleImage;
    var timeStamp = new Date().getTime();
    var imageName = './images/'+timeStamp+'_img.jpg';
    console.log(imageName);
    articleImage.mv(imageName, function(err) {
        if (err) {
        	console.log(err);
            res.status(500).send(err);
        }
        else {
            console.log("File uploaded  Moved ");
        }
    });

    pool.query('INSERT INTO "article" (title,content,image) values($1,$2,$3)',[title,content,timeStamp+'_img.jpg'],function(err,result){
    	if(err) console.log(err);
    	
    	console.log("Query insert ::")
    });

    res.redirect('/');
    
});



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
