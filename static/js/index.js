console.log('Begin index.js');

var c = $('#gameCanvas')[0];
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(0,0,600,400);

var date = new Date();
var time = date.getTime();
function startTimer() {
    time = date.getTime();
}
function endTimer() {
    console.log('SockJS: ping=%dms', date.getTime() - time)
}

var sock = new SockJS('http://localhost:3000/add');
sock.onopen = function() {
    console.log('SockJS: open');
    sock.send('5');
}
sock.onmessage = function(e) {
    //console.log('SockJS: message', e.data);
    endTimer()
    sock.send(e.data)
    startTimer()
};
sock.onclose = function() {
    console.log('SockJS: close');
};
