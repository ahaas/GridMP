settings = {
    HOST: location.origin
          .match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0],
    COLOR_BG: '#222222',
    COLOR_TILE: '#333333',
    GRID_WIDTH: 10,
    GRID_HEIGHT: 10,
    CANVAS: $('#gameCanvas')[0],
    CANVAS_WIDTH: $('#gameCanvas')[0].width,
    CANVAS_HEIGHT: $('#gameCanvas')[0].height,
}


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
    sock.send('5');
}
sock.onmessage = function(e) {
    //message = $.parseJSON(e.data) TODO: Uncomment
    //if ('worldState' in e.data) {
        renderWorldState(e.data.worldState);
    //} else if ('event' in e.data) {
    //    renderEvent(e.data.event);
    //}
};
sock.onclose = function() {
    console.log('SockJS: close');
};



var renderWorldState = function(worldState) {
    var canvas = settings.CANVAS;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = settings.COLOR_BG;
    ctx.fillRect(0, 0, settings.CANVAS_WIDTH, settings.CANVAS_HEIGHT);
    ctx.fillStyle = settings.COLOR_TILE;
    for (var x=0; x<settings.GRID_WIDTH; x++) {
        for (var y=0; y<settings.GRID_HEIGHT; y++) {
            ctx.fillRect(x*50+2, y*50+2, 46, 46);
        }
    }
}

var renderEvent = function(evt) {

}
