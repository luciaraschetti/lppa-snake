'use strict'

var pause = true;
var score = 0;
var gameOver = true;
var points = null;
var emojis = null;
var game = null;
var menu = null;
var currentScene = 0;
var scenes = [];
var canvas = null;
var context = null;
var lastPress = null;
var keyLeft = 37;
var keyUp = 38;
var keyRight = 39;
var keyDown = 40;
var keyEnter = 13;
var keySpace = 32;
var body = [];
var walls = [];
var food = null;
var snake = new Image();
var star = new Image();
var quack = new Audio();
var chomp = new Audio();
var dir = 0;


document.addEventListener('keydown', function(evt) {
    lastPress = evt.which;
}, false);

var random = function(max) {
    return ~~(Math.random() * max);
}

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
    //draws canvas & content
    context.fillStyle = '#1f7380';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#eae2b7';
    context.font = '10px Arial'
    context.textAlign = 'center';
    context.fillText('SNAKE GAME', 150, 60);
    context.fillText('Press Enter', 150, 90);
};

menu.act = function() {
    //switches to 'game' scene when pressing enter
    if(lastPress === keyEnter) {
        loadScene(game);
        lastPress = null;
    }
};

game = new scene();

game.load = function() {
    score = 0;
    dir = 1;
    body.length = 0;
    body.push(new Rectangle(40, 10, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    //randomized food position
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
    gameOver = false;
}

//draws canvas & content
game.paint = function() { 
    context.fillStyle = '#1f7380';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < body.length; i += 1) {
        context.drawImage(snake, body[i].x, body[i].y);
    }

    context.drawImage(star, food.x, food.y);

    context.fillStyle = '#11393f';
    for(var i = 0; i < walls.length; i += 1) {
        walls[i].fill(context);
    }

    context.fillStyle = '#eae2b7';
    context.fillText('Score : ' + score, 5, 13);

    if(pause) {
        context.textAlign = 'center';
        if(gameOver) {
            context.fillStyle = '#941f0d';
            context.fillText('Game Over', 150, 95);
        } else {
            context.fillText('Pause', 150, 20);
        }
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
        //reset game
        if(gameOver) {loadScene(menu);}
        //directions
        if(lastPress === keyUp) {
            dir = 0;
        }
        if(lastPress === keyRight) {
            dir = 1;
        }
        if(lastPress === keyDown) {
            dir = 2;
        }
        if(lastPress === keyLeft) {
            dir = 3;
        }
        //head movement
        if(dir === 0) {body[0].y -= 10; snake.src = 'assets/bodyv.png';}
        if(dir === 1) {body[0].x += 10; snake.src = 'assets/body.png';}
        if(dir === 2) {body[0].y += 10; snake.src = 'assets/bodyv.png';}
        if(dir === 3) {body[0].x -= 10; snake.src = 'assets/body.png';}
        //body movement (worm-like effect)
        for(var i = body.length - 1; i > 0; i -= 1) {
            body[i].x = body[i - 1].x;
            body[i].y = body[i - 1].y; 
        }
        //body intersection
        for(var i = 3; i < body.length; i += 1) {
            if(body[0]. intersects(body[i])) {
                //plays dying sound
                quack.play();
                gameOver = true;
                pause = true;
            }
        }
        //snake & food intersection
        if(body[0].intersects(food)) { 
            //plays eating sound
            chomp.play();
            //adds new rectangle to body
            body.push(new Rectangle(food.x, food.y, 10, 10));
            score += 1;
            //scoreboard
            for(var i = 0; i < points.length; i++) {
                if(score == points[i].innerHTML) {
                    points[i].setAttribute('style', 'display: none');
                    emojis[i].setAttribute('style', 'display: inline');
                }
            }
            //moves food rectangle if it collides with the player
            food.x = random(canvas.width / 10 - 1) * 10;
            food.y = random(canvas.height / 10 - 1) * 10;
        }
        //walls intersection
        for(var i = 0; i < walls.length; i += 1) {
            //moves food rectangle if it collides with a wall
            if(food.intersects(walls[i])) { 
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
            }
            //game over when snake collides with a wall
            if(body[0].intersects(walls[i])) {
                //plays dying sound
                quack.play();
                pause = true;
                gameOver = true;
            }
        }
        //canvas limits
        if( body[0].x > canvas.width - body[0].width) {body[0].x = 0;}
        if(body[0].x < 0) {body[0].x = canvas.width - body[0].width;}
        if(body[0].y > canvas.height - body[0].height) {body[0].y = 0;}
        if(body[0].y < 0) {body[0].y = canvas.height - body[0].height;}
    }
}

//rectangle obj 
var Rectangle = function(x, y, width, height) { 
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

    this.intersects = function(rect) {
        if(rect === undefined) {
            window.console.warn('Missing parameters on function intersects');
        } else {
            return(this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
        }
    }

}

//browser compatibility
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 17);
    }
}());

window.onload = function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    points = document.getElementsByClassName('points');
    emojis = document.getElementsByClassName('emoji');
    food = new Rectangle(80, 80, 10, 10);
    walls.push(new Rectangle(30, 100, 10, 30));
    walls.push(new Rectangle(40, 110, 50, 10));
    walls.push(new Rectangle(125, 35, 50, 10));
    walls.push(new Rectangle(145, 45, 10, 35));
    walls.push(new Rectangle(270, 100, 10, 30));
    walls.push(new Rectangle(220, 110, 50, 10));
    quack.src = 'assets/quack.oga';
    quack.volume = 0.1;
    chomp.src = 'assets/chomp.oga';
    chomp.volume = 0.1;
    snake.src = 'assets/body.png'
    star.src = 'assets/star.png';
    run();
    repaint();
}