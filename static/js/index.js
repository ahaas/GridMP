settings = {}
settings.HOST = location.origin
                .match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0],
settings.COLOR_BG = '#181818',
settings.COLOR_TILE = '#333333',
settings.COLOR_PLAYER = '#003399',
settings.GRID_WIDTH = 10,
settings.GRID_HEIGHT = 10,
settings.TILE_SIZE = 50, // tile size, in pixels
settings.CANVAS = $('#gameCanvas')[0],

// AUTOMATIC SETTINGS
settings.CANVAS_WIDTH = settings.CANVAS.width,
settings.CANVAS_HEIGHT = settings.CANVAS.height,
settings.GRID_WIDTH = Math.floor(
        settings.CANVAS_WIDTH/settings.TILE_SIZE)
settings.GRID_HEIGHT = Math.floor(
        settings.CANVAS_HEIGHT/settings.TILE_SIZE)

settings.server = {}

gridmp = {}
gridmp.pressedKeys = [];



var c = $('#gameCanvas')[0];
var ctx = c.getContext("2d");
ctx.fillStyle = "#000000";
ctx.fillRect(0,0,1000,1000);


// Timer, for ping testing purposes
var startTime = Date.now();
function startTimer() {
    startTime = Date.now();
}
function getTimer() {
    return Date.now() - startTime
}


var sock = new SockJS(settings.HOST + '/add');
sock.onopen = function() {
    console.log('SockJS: open');
}
sock.onmessage = function(e) {
    m = JSON.parse(e.data);
    console.log('Socket js: received message' + m);
    switch (m.type) {
        case 'settings':
            onReceiveServerSettings();
            settings.server = m.payload;
            break;
        case 'worldState':
            renderWorldState(m.payload);
            break;
        case 'event':
            renderEvent(m.payload);
            break;
    }
};
sock.onclose = function() {
    console.log('SockJS: close');
};


var onReceiveServerSettings = function() {
    setInterval(function() {
        console.log('sendingkeypresses')
        sock.send(JSON.stringify({type: 'pressedKeys', 
                                  payload: gridmp.pressedKeys}));
    }, settings.server.SERVER_INTERVAL_S);
}


var drawTile = function(ctx, x, y, inset, color) {
    // x, y are coordinates of the tile within the grid
    // inset is the amount of pixels around border to not draw
    inset = inset || 0
    color = color || '#000000'
    ctx.fillRect(
        x*settings.TILE_SIZE + inset,
        y*settings.TILE_SIZE + inset,
        settings.TILE_SIZE-inset*2,
        settings.TILE_SIZE-inset*2)
}

var renderWorldState = function(worldState) {
    var ctx = settings.CANVAS.getContext("2d");
    ctx.fillStyle = settings.COLOR_BG;
    ctx.fillRect(0, 0, settings.CANVAS_WIDTH, settings.CANVAS_HEIGHT);
    ctx.fillStyle = settings.COLOR_TILE;
    for (var x=0; x<settings.GRID_WIDTH; x++) {
        for (var y=0; y<settings.GRID_HEIGHT; y++) {
            drawTile(ctx, x, y, 2, settings.COLOR_TILE);
        }
    }
    if (worldState && worldState.players) {
        _.each(worldState.players, function(ply) {
            drawTile(ply.pos.x, ply.pos.y, settings.COLOR_PLAYER);
        });
    }
}
renderWorldState();

var renderEvent = function(evt) {

}
