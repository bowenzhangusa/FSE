var express = require("express");
var app = express();
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
var port = 3700;
 
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
//db.run('CREATE TABLE message (name TEXT, message TEXT, date LONG)');

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='message'",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run('CREATE TABLE message (name TEXT, message TEXT, date TEXT)', function(err) {
      if(err !== null) {
        console.log(err);
      }
      else {
        console.log("SQL Table 'message' created.");
      }
    });
  }
  else {
    console.log("SQL Table 'message' already created.");
  }
});

app.use(express.static(__dirname + '/public')); 

var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    
    db.each('SELECT name, message, date FROM message', function(err, row) {
    socket.emit('message', { message: row.message, username: row.name, timestamp: row.date } );
  });
    console.log("finished db selection");
    socket.on('send', function (data) {
        console.log("inside index.js");
	console.log(data);
	sqlRequest = "INSERT INTO 'message' (name, message, date) " +
               "VALUES('" + data.username + "', '" + data.message + "', '" + data.timestamp + "')";
	console.log(sqlRequest);
	db.run(sqlRequest, function(err) {
	    if (err !== null) {
		console.log(err);
	    }
	});
	io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);
