settings = {}
settings.SERVER_FRAME_RATE = 1

// automatic settings
settings.SERVER_INTERVAL_S = 1000/settings.SERVER_FRAME_RATE

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
    sockNewConnection: function(conn) {
        // On a new connecction
        var ply = new Player(conn);
        ply.pos = new Pos(0, 0);
        conn.player = ply;
        gameState.players.push(ply)
        console.log('New player generated');
        conn.write(JSON.stringify({type: 'settings', payload: settings}))
    },
    sockNewData: function (conn, m) {
        console.log('RECVD ' + m);
        m = JSON.parse(m)
        switch(m.type) {
            case 'keyPresses':
                console.log('KEYPRESSES');
                break;
        }
    },
    sockClosedConnection: function (conn) {
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
    _.each(gameState.players, function(ply) {
        if (ply.conn) {
            ply.conn.write('{"type": "info", '
                + '"payload": "This is a socket message to the player."}');
        }
    });
}, settings.SERVER_INTERVAL_S);
