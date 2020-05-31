'use strict'
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

menu.paint = function(context) {
    context.fillStyle = '#1f7380';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#eae2b7';
    context.font = '10px Arial'
    context.textAlign = 'center';
    context.fillText('SNAKE GAME', 150, 60);
    context.fillText('Press Enter', 150, 90);
};

window.onload = function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    run();
    repaint();
}