var express = require('express');
var morgan = require('morgan');
var path = require('path');
var session = require('express-session');
var xssFilters = require('xss-filters');
//For the file upload 
//var fileUpload = require('express-fileupload');


var app = express();
app.use(morgan('combined'));


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
 
//app.use(express.cookieParser('12321'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
app.use(session({secret: 'neema@31256'}));

// default options 
//app.use(fileUpload()); 

// Database connection 

var pg = require('pg');
var sess;
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
	sess = req.session;
	console.log(req.session);
    res.sendFile(path.join(__dirname, 'ui', 'index_bkp2.html'));
});

app.get('/checkSession', function (req, res) {
	sess = req.session;
	if(sess.uid){
		res.send(JSON.stringify({ status: sess.uid}));
	}
	else{
		res.send(JSON.stringify({ status: 'FAIL'}));
	}
});

app.get('/register', function (req, res) {
	sess = req.session;
	if(sess.uid){
		res.redirect('/');
	}
	else{
		res.sendFile(path.join(__dirname, 'ui', 'register.html'));
	}
  
});

app.get('/contact',function (req,res){
	res.sendFile(path.join(__dirname,'ui','contact.html'));
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

app.get('/article/:id', function (req, res) {
    var articleName=req.params.id;
 	//res.send(createtemplate(articles[articleName]));
 	res.sendFile(path.join(__dirname, 'ui', 'article.html'));
});
// Ajax content load methods

app.get('/getAllArticles', function (req, res) {
	getHomeArticles(res);
});

app.get('/getComments/:id', function (req, res) {
	var articleId=req.params.id;
	getComments(res,articleId);
});


app.get('/getArticle/:id', function (req, res) {
    var articleId=req.params.id;
    getArticle(res,articleId);
 	//res.send(createtemplate(articles[articleName]));
 	//res.send(articleId+' Article  content comes here ');
});

app.get('/logout', function (req, res){
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect('/');
		}
	});
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
app.get('/images/bg.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'bg.png'));
});
app.get('/ui/images/cover.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'cover.jpg'));
});

// Post methods

app.post('/regValidate',function(req,res){
    var name = req.body.user.name;
    var email = req.body.user.email;
    var password = req.body.user.password;
    
    // Validate the user

    //Check whether the email already exists . 
    res.setHeader('Content-Type', 'application/json');
    pool.query('SELECT uid FROM "user" WHERE email=$1',[email],function(err,result){
    	if(err) console.log(err);
    	if(result.rowCount == 0){
    		res.send(JSON.stringify({ status: 'OK'}));
    	}
    	else{
    		res.send(JSON.stringify({ status: 'FAIL',msg: 'Email Already exists'}));
    	}
    	
    });
    
    
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
    res.send(JSON.stringify({ status: 'OK'}));
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
    
    
    //res.redirect('/');
});

app.post('/userLogin',function(req,res){
	sess = req.session;
	var username = req.body.user.name;
	var password = req.body.user.pass;
	if(username != '' && password !=''){
		pool.query('SELECT uid FROM "user" WHERE email=$1 AND pwd=$2',[username,password],function(err,result){
			if(err) console.log(err);
			else{
				console.log(result);
				if(result.rowCount >0){
					result.rows.forEach(function (item){
						if(item.uid >0){
							console.log("User is there "+item.uid);
							sess.uid = item.uid;
							console.log(sess);
							res.send(JSON.stringify({ status: 'OK',uid: item.uid}));
						}
					});
				}else{
					res.send(JSON.stringify({ status: 'FAIL'}));
				}
			}
		});
	}
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

// Post comment 

app.post('/postComment',function(req,res){
    
    var uid = req.body.uid;
    var comment = req.body.comment;
    var articleId = req.body.articleId;
    

    pool.query('INSERT INTO "comment" (uid,comment,article_id) values($1,$2,$3)',[uid,comment,articleId],function(err,result){
    	if(err) console.log(err);
    	
    	console.log("Query insert ::");
    	res.send(JSON.stringify({status :'OK'}))
    });

    
    
});

// Post contact form 

app.post('/contactSubmit',function(req,res){
    var name = req.body.user.name;
    var email = req.body.user.email;
    var message = req.body.user.message;
    
    // Insert into the db
    res.setHeader('Content-Type', 'application/json');
    pool.query('INSERT INTO "contact" (name,mail,message) values($1,$2,$3)',[name,email,message],function(err,result){
    	if(err) console.log(err);
    	
    	
    });
    res.send(JSON.stringify({ status: 'OK'}));
    
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

//Ui methods 

function getHomeArticles(res){
	var html_article = '';
	pool.query('SELECT * FROM "article"  ',[],function(err,result){
    	if(err) console.log(err);
    	else{
    		//console.log(result);
    		if(result.rowCount>0){
    			result.rows.forEach(function (item) {
				  	  console.log(item);
				  	  var content = text_truncate(item.content,400);
				  	  html_article += '<div class="row rowPad"><div class="col-md-10"><div class="media"><div class="media-left">';
				      //html_article +='<img class="media-object" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PGRlZnMvPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjEzLjQ2MDkzNzUiIHk9IjMyIiBzdHlsZT0iZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQ7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NjR4NjQ8L3RleHQ+PC9nPjwvc3ZnPg==" alt="...">';
                	  html_article +='</div><div class="media-body"><h4 class="media-heading"><a href="/article/'+item.article_id+'">'+item.title+'</a></h4>'+content;
              		  html_article += '</div></div></div></div>';
              		  
				});
				return res.send(html_article);
    		}
    	}
    	
    });
	
}

function getArticle(res,id){
	var html_article = '';
	pool.query('SELECT * FROM "article" WHERE article_id=$1 ',[id],function(err,result){
    	if(err) console.log(err);
    	else{
    		//console.log(result);
    		if(result.rowCount>0){
    			result.rows.forEach(function (item) {
				  console.log(item);
				  	  	
				  	  html_article += '<div class="row rowPad"><div class="col-md-8 col-centered"><div class="media"><div class="">'; 
				      
                	  html_article +='</div><div class="media-body"><h2 class="media-heading">'+item.title+'</h2>';
                	  if(item.image) html_article +='<img style="width:20rem" class="media-object" src="'+item.image+'" alt="...">';
                	  html_article +=item.content;
              		  html_article += '</div></div></div></div>';
              		  
				});
				return res.send(html_article);
    		}
    	}
    	
    });
	
}
// Get the comment list for the article .. 
function getComments(res,articleId){
	var html_comments = '';
	pool.query('SELECT * FROM "comment" c,"user" u WHERE u.uid=c.uid AND article_id=$1 ',[articleId],function(err,result){
    	if(err) console.log(err);
    	else{
    		console.log(result);
    		if(result.rowCount>0){
    			result.rows.forEach(function (item) {
				  	  console.log(item);
				  	  var createdTime = prettyDate(item.created);
				  	  console.log("Comment created at "+createdTime);
				  	  html_comments += '<li class="clearfix"><div class="post-comments">';
				  	  html_comments+= '<p class="meta"><a href="#">'+item.uname+'</a> says('+createdTime+') : <i class="pull-right"><a href="#" style="display:none"><small>Reply</small></a></i></p>';
                      html_comments+= '<p>'+xssFilters.inHTMLData(item.comment)+'</p></div></li>';
				      
              		  
				});
				return res.send(html_comments);
    		}
    	}
    	
    });
}
text_truncate = function(str, length, ending) {  
    if (length == null) {  
      length = 100;  
    }  
    if (ending == null) {  
      ending = '...';  
    }  
    if (str.length > length) {  
      return str.substring(0, length - ending.length) + ending;  
    } else {  
      return str;  
    }  
  };  

//   function prettyDate(time) {
//     var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
//         diff = (((new Date()).getTime() - date.getTime()) / 1000),
//         day_diff = Math.floor(diff / 86400);

//     if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return;

//     return day_diff == 0 && (
//     diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && Math.floor(diff / 3600) + " hours ago") || day_diff == 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
// }
function prettyDate(time) {
    var date = new Date((time || "")),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);
    var year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate();

    if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
        return (
            year.toString()+'-'
            +((month<10) ? '0'+month.toString() : month.toString())+'-'
            +((day<10) ? '0'+day.toString() : day.toString())
        );

    var r =
    ( 
        (
            day_diff == 0 && 
            (
                (diff < 60 && "just now")
                || (diff < 120 && "1 minute ago")
                || (diff < 3600 && Math.floor(diff / 60) + " minutes ago")
                || (diff < 7200 && "1 hour ago")
                || (diff < 86400 && Math.floor(diff / 3600) + " hours ago")
            )
        )
        || (day_diff == 1 && "Yesterday")
        || (day_diff < 7 && day_diff + " days ago")
        || (day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago")
    );
    return r;
}