"use strict";
enchant();

var game = null;

window.onload = function() {
    game = new Game(320, 320);
    game.fps = 24;
    game.enemy_speed = 1;
    game.preload('chara1.png', 'icon0.png');
    //game.pushScene(createTitleScene(game)); 
    game.onload = function () {
        game.pushScene(createActionScene(game));
    }
    game.start();
};

function playerDead(game) {
    game.pushScene(createEndingScene(game));
}

/* a level will have a series of timed triggers that summon
enemies, effects / background changes, and powerups */
function createActionScene(game) {
    var scene = new Scene();
    
    scene.backgroundColor = '#671F70';
   
    out('Assets: ' + game.assets)
    game.player= new Player(150,150);

    var text = new Label('Player: ' + game.player.x + ', ' + game.player.y);
    text.color = 'black';
    text.x = 0;
    text.y = 0;
    scene.addChild(text);

    var laser = new LaserBeam({x:0,y:0},{x:game.width,y:game.height},10,45);
    out('Laser points :' + laser.points.length);
    laser.points.forEach(function (x) {
        out('Adding to scene: ' + JSON.stringify(x));
        scene.addChild(x);
    });
    game.laser = laser;

    scene.addEventListener('enterframe', function() {
        text.text = 'Player: ' + game.player.x + ', ' + game.player.y;
        var GRAVITY = 4.0;
        game.player.y += GRAVITY;
    });
    scene.addEventListener('touchstart', function(e) {
	    game.touched = true;
        game.player.y -= 20.0;
    });
    scene.addEventListener('touchend', function(e) {
	    game.touched = false;
    });
    out('Player: ' + game.player.toString());
    scene.addChild(game.player);
    return scene;
}

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x,y) {
        enchant.Sprite.call(this, 16, 16);
        out('game.assets ' + game.assets['icon0.png']);
        this.image = game.assets['icon0.png'];
        this.x = x; this.y = y;
        this.frame = 44;
    },
    toString: function () {
        return JSON.stringify(this);
    }
});

var Laser = enchant.Class.create(enchant.Sprite, {
    initialize: function(x,y, frame) {
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.png']
        this.x = x; this.y = y;
        this.frame = frame;
    }
});

var out = function(x) { console.log(x); }

var printObject = function (obj) {
    return JSON.stringify(obj);
}

var LaserBeam = function(start, end, points, frame) {
    var laserLerp = lerp(start,end);
    var delta = game.width / points;
    this.points = [];
    for(var i=0;i<points;i++) {
        var sx = i * delta;
        var sy = laserLerp(sx);
        this.points.push(new Laser(sx,sy,frame));
    }
};

function isOutOfBounds(x, y, width, height) {
    return y > game.height || x > game.width || x < -width || y < -height;
}

function rand(num){ return Math.floor(Math.random() * num) };

function lerp(start, end) {
    var y = start.y + (end.y - start.y);
    var xd = end.x - start.x;
    return function(x) {
        return y + (x - start.x)/xd;
    };
}

function createEndingScene(game) {
    var endScene = new Scene();
    endScene.backgroundColor = 'black';
    var text = new Label("You have died.");
    text.color = 'red';
    text.x = 100;
    text.y = game.height / 2.0;
    endScene.addChild(text);

    endScene.addEventListener('touchstart', function(e) {
	    game.popScene();
	    game.popScene();
    });
    return endScene;
}

function createTitleScene(game) {
    var titleScene = new Scene();
    titleScene.backgroundColor = 'red';
    var text = new Label('The Ink');
    text.color = 'black';
    text.x = 100;
    text.y = game.height / 2.0;
    titleScene.addChild(text);
    
    titleScene.addEventListener('touchstart', function(e) {
	    game.pushScene(createActionScene(game));
    });
    return titleScene;
}
