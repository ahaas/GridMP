console.log('Begin index.js');

var c = $('#gameCanvas')[0];
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(0,0,600,400);

var startTime = Date.now();
function startTimer() {
    startTime = Date.now();
}
function endTimer() {
    console.log('SockJS: ping=%dms', Date.now() - startTime)
}

var host = location.origin;
host = host.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0];
host += '/add';
console.log('SocketJS: host=' + host);

var sock = new SockJS(host);
sock.onopen = function() {
    console.log('SockJS: open');
    sock.send('5');
}
sock.onmessage = function(e) {
    endTimer()
    setTimeout(function() {
        sock.send(e.data)
        startTimer()
    }, 3000)
};
sock.onclose = function() {
    console.log('SockJS: close');
};
