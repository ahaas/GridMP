settings = {};
settings.SERVER_FRAME_RATE = 20;
settings.MOVE_RATE = .08;
settings.GRID_WIDTH = 10;
settings.GRID_HEIGHT = 10;

// automatic settings
settings.SERVER_INTERVAL_S = 1000/settings.SERVER_FRAME_RATE
settings.MOVE_RATE_PER_TICK = settings.MOVE_RATE * 
                              settings.SERVER_INTERVAL_S

function Pos(x, y) {
    this.x = x;
    this.y = y;
    this.putInBounds = function() {
        function clamp(x, min, max) {
            return Math.min(Math.max(x, min), max);
        }
        this.x = clamp(this.x, 0, settings.GRID_WIDTH - 1);
        this.y = clamp(this.y, 0, settings.GRID_HEIGHT - 1);
    };
}

function Player(conn) {
    this.conn = conn;
    this.connID = conn.id;
    this.pos = null;
    this.channeling = false;
    this.channelingType = null;
    this.pressedKeys = [];
    this.lastMoved = 0;
    this.canMove = function () {
        return new Date().getTime() - this.lastMoved > settings.MOVE_RATE;
    };
    this.updateMoved = function () {
        this.lastMoved = new Date().getTime();
    };
    this.tryMove = function(direction) {
        if (!this.canMove()) {
            return
        }
        console.log('\nTRYMOVE');
        console.log(direction)
        console.log(this.pos)
        switch(direction) {
            case 'up':
                this.pos.y--;
                break;
            case 'down':
                this.pos.y++;
                break;
            case 'left':
                this.pos.x--;
                break;
            case 'right':
                this.pos.x++;
                break;
        }
        console.log(this.pos)
        this.pos.putInBounds();
        this.updateMoved()
            console.log('\nTRYMOVE');;
    }
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
        conn.write(JSON.stringify({type: 'settings', payload: settings}))
    },
    sockNewData: function (conn, m) {
        m = JSON.parse(m)
        switch(m.type) {
            case 'pressedKeys':
                conn.player.pressedKeys = m.payload
                break;
        }
    },
    sockClosedConnection: function (conn) {
        console.log('Sock JS: Connection closed');
        if (conn.player) {
            gameState.players = _.without(gameState.players,
                                          conn.player);
        } else {
            _.each(gameState.players, function(ply, idx) {
                if (ply.conn == conn) {
                    gameState.players = _.without(gameState.players,
                                                  conn.player);
                }
            });
        }
    }
}

var simulateGameTick = function() {
    _.each(gameState.players, function(ply) {
        if (ply.canMove()) {
            if (_.contains(ply.pressedKeys, 'up')) {
                ply.tryMove('up');
            } else if (_.contains(ply.pressedKeys, 'left')) {
                ply.tryMove('left');
            } else if (_.contains(ply.pressedKeys, 'right')) {
                ply.tryMove('right');
            } else if (_.contains(ply.pressedKeys, 'down')) {
                ply.tryMove('down');
            }
        }
    })
}

setInterval(function() {
    simulateGameTick()
    // Reconstruct stripped gameState
    sharedGameState = {
        players: []
    }
    _.each(gameState.players, function(ply, idx) {
        sharedGameState.players[idx] = {
            pos: ply.pos
        }
    })
    // Send it to the players
    _.each(gameState.players, function(ply) {
        if (ply.conn) {
            ply.conn.write(JSON.stringify({
                type: 'gameState',
                payload: sharedGameState
            }));
        }
    });
}, settings.SERVER_INTERVAL_S);
