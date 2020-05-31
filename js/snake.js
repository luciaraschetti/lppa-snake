'use strict'
var pause = true;
var game = null;
var menu = null;
var currentScene = 0;
var scenes = [];
var canvas = null;
var context = null;
var lastPress = null;
var pause = true;
var keyLeft = 37;
var keyUp = 38;
var keyRight = 39;
var keyDown = 40;
var keyEnter = 13;
var keySpace = 32;
var body = [];
var dir = 0;


document.addEventListener('keydown', function(evt) {
    lastPress = evt.which;
}, false);

var scene = function() {
    this.id = scenes.length;
    scenes.push(this);
}

scene.prototype = {
    constructor: scene,
    load: function() {},
    paint: function(context) {},
    act: function() {}
};

var loadScene = function(scene) {
    currentScene = scene.id;
    scenes[currentScene].load();
}

var repaint = function() {
    window.requestAnimationFrame(repaint);
    if(scenes.length) {
        scenes[currentScene].paint(context);
    }
}

var run = function() {
    setTimeout(run, 80);
    if(scenes.length) {
        scenes[currentScene].act();
    }
}

menu = new scene();

menu.paint = function(context) { //draws canvas & content
    context.fillStyle = '#1f7380';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#eae2b7';
    context.font = '10px Arial'
    context.textAlign = 'center';
    context.fillText('SNAKE GAME', 150, 60);
    context.fillText('Press Enter', 150, 90);
};

menu.act = function() {
    if(lastPress === keyEnter) { //switches to 'game' scene when pressing enter
        loadScene(game);
        lastPress = null;
    }
};

game = new scene();

game.load = function() {
    dir = 1;
    body.length = 0;
    body.push(new Rectangle(40, 40, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
}

game.paint = function() { //draws canvas & content
    context.fillStyle = '#1f7380';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#eb452b';
    for(var i = 0; i < body.length; i += 1) {
        body[i].fill(context);
    }

    if(pause) {
        context.fillStyle = '#eae2b7';
        context.textAlign = 'center';
        context.fillText('Pause', 150, 20);
        context.textAlign = 'left';
    }
}

game.act = function() {
    //pause
    if(lastPress === keyEnter) {
        pause =! pause;
        lastPress = null;
    }
    if(!pause){
        //directions
        if(lastPress === keyUp) {dir = 0}
        if(lastPress === keyRight) {dir = 1}
        if(lastPress === keyDown) {dir = 2}
        if(lastPress === keyLeft) {dir = 3}
        //head movement
        if(dir === 0) {body[0].y -= 10}
        if(dir === 1) {body[0].x += 10}
        if(dir === 2) {body[0].y += 10}
        if(dir === 3) {body[0].x -= 10}
        //body movement (worm-like effect)
        for(var i = body.length - 1; i > 0; i -= 1) {
            body[i].x = body[i - 1].x;
            body[i].y = body[i - 1].y; 
        }
    }
}

var Rectangle = function(x, y, width, height) { //rectangle obj 
    this.x = (x === undefined) ? 0 : x;
    this.y = (y === undefined) ? 0 : y;
    this.width = (width === undefined) ? 0 : width;
    this.height = (height === undefined) ? this.width : height;

    this.fill = function(context) {
        if(context === undefined) {
            window.console.warn('Missing parameters on function fill');
        } else {
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

window.onload = function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    run();
    repaint();
}