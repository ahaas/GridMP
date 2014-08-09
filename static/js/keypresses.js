(function() {
 
gridmp.pressedKeys = [];

var keyCodeToName = {
    65: 'attack1',
    83: 'attack2',
    68: 'attack3',
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right'
}

window.addEventListener("keydown",
    function(e) {
        key = keyCodeToName[e.keyCode]
        if (key && !_.contains(gridmp.pressedKeys, key)) {
            gridmp.pressedKeys.push(key);
            gridmp.sendInput();
        }
    },
false);

window.addEventListener("keyup",
    function(e){
        key = keyCodeToName[e.keyCode]
        if (key && _.contains(gridmp.pressedKeys, key)) {
            gridmp.pressedKeys = 
                    _.without(gridmp.pressedKeys, key);
            gridmp.sendInput();
        }
    },
false);

})();
