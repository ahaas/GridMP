var express = require('express');
var http = require('http');
var sockjs = require('sockjs');
var app = express();
var port = process.env.PORT || 3000

// begin sockjs stuff
var sockjsAdd = sockjs.createServer();
sockjsAdd.on('connection', function(conn) {
    console.log('New SockJS connection, id=' + conn.id);
    conn.on('data', function(message) {
        console.log('SockJS received message: ' + message);
        output = (parseInt(message) + 1).toString();
        console.log('SockJS sending in response: ' + output);
        conn.write(output);
    });
    conn.on('close', function() {});
});

app.set('view engine', 'jade');

// static server
app.use(express.static(__dirname + '/static'));

// index server
app.get('/', function(req, res){
    res.render('index');
});

var server = http.createServer(app).listen(port, function(){
    console.log('Listening on %d.', port)
});
sockjsAdd.installHandlers(server, {prefix:'/add'});
