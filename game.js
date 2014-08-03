SERVER_FRAME_RATE = 1

function Pos(x, y) {
    this.x = x;
    this.y = y;
}

function Player(conn) {
    this.conn = conn;
    this.connID = conn.id;
    this.pos = null;
    this.channeling = false;
    this.channeling_type = null;
}

var gameState = {
    players: []
}

module.exports = {
    sockNew: function(conn) {
        var ply = new Player(conn);
        ply.pos = new Pos(0, 0);
        conn.player = ply;
        gameState.players.push(ply)
        console.log('New player generated');
    },
    sockNewData: function (conn, message) {
        console.log('SOCKJS RECEIVED: ' + message);
    },
    sockClosed: function (conn) {
        if (conn.player) {
            delete gameState.players[conn.player];
        } else {
            _.each(gameState.players, function(ply) {
                if (ply.conn == conn) {
                    delete gameState.players[ply];
                }
            });
        }
    }
}

setInterval(function() {
    console.log(gameState);
    console.log(gameState.players.length);
    _.each(gameState.players, function(ply) {
        console.log('Player has conn: ' + ply.conn);
        if (ply.conn) {
            console.log('Sent message');
            ply.conn.write('This is a socket message to the player.');
        }
    });
}, 1000/SERVER_FRAME_RATE);
