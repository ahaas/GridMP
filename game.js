settings = {};
settings.SERVER_FRAME_RATE = 20;
settings.MOVE_RATE = .333;
settings.GRID_WIDTH = 10;
settings.GRID_HEIGHT = 10;

// automatic settings
settings.SERVER_INTERVAL_S = 1000/settings.SERVER_FRAME_RATE
settings.MOVE_RATE_PER_TICK = settings.MOVE_RATE * settings.SERVER_INTERVAL_S

function Pos(x, y) {
    this.x = x;
    this.y = y;
    this.putInBounds = function() {
        function clamp(x, min, max) {
            return Math.min(Math.max(x, min), max);
        }
        this.x = clamp(x, 0, settings.GRID_WIDTH - 1);
        this.y = clamp(y, 0, settings.GRID_HEIGHT - 1);
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
        this.lastMoved = Date().getTime();
    };
    this.tryMove = function(direction) {
        if (!this.canMove()) {
            return
        }
        switch(direction) {
            case 'up':
                this.y--;
                break;
            case 'down':
                this.y++;
                break;
            case 'left':
                this.x--;
                break;
            case 'right':
                this.x++;
                break;
        }
        this.pos.putInBounds();
        this.updateMoved();
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

var simulateGameTick = function() {
    _.each(gameState.players, function(ply) {
        if (ply.canMove()) {
            if ($inArray('up', ply.pressedKeys)) {
                ply.tryMove('up');
            } else if ($inArray('left', ply.pressedKeys)) {
                ply.tryMove('left');
            } else if ($inArray('right', ply.pressedKeys)) {
                ply.tryMove('right');
            } else if ($inArray('down', ply.pressedKeys)) {
                ply.tryMove('down');
            }
        }
    })
}

setInterval(function() {
    // Reconstruct stripped gameState
    sharedGameState = {
        
    }
    _.each(gameState.players
    sharedGameState.players.ma
    _.each(gameState.players, function(ply) {
        if (ply.conn) {
            ply.conn.write(JSON.stringify({
                type: 'gameState',
                payload: {
                    
                };
            }));
        }
    });
}, settings.SERVER_INTERVAL_S);
