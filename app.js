_ = require('underscore');

var express = require('express');
var http = require('http');
var sockjs = require('sockjs');
var app = express();
var port = process.env.PORT || 3000;
game = require('./game.js');


// begin sockjs stuff
var sockjsAdd = sockjs.createServer();
sockjsAdd.on('connection', function(conn) {

    game.sockNewConnection(conn);

    conn.on('data', function(message) {
        game.sockNewData(conn, message);
    });

    conn.on('close', function() {
        game.sockClosedConnection(conn);
    });

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
