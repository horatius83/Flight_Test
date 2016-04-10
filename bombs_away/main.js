"use strict";
enchant();

var game = null;

window.onload = function() {
    game = new Game(320, 320);
    game.fps = 24;
    game.enemy_speed = 1;
    game.preload('chara1.png', 'icon0.png');
    game.altitude = 3000;
    //game.pushScene(createTitleScene(game)); 
    game.onload = function () {
        game.pushScene(createActionScene(game));
    }
    game.start();
};

function createActionScene(game) {
    var scene = new Scene();
    // background color
    var bgcolor_lerp = colorLerp(
            {start:game.altitude, end:0},
            {red:0, green:24, blue:51},
            {red:179, green:215, blue:255});

    //scene.backgroundColor = '#671F70';
    scene.backgroundColor = bgcolor_lerp(game.altitude);
   
    out('Assets: ' + game.assets)
    game.player = createSprite(150,150,44,'icon0.png');

    var text = new Label('Player: ' + game.player.x + ', ' + game.player.y);
    text.color = 'white';
    text.x = 0;
    text.y = 0;
    scene.addChild(text);

    scene.addEventListener('enterframe', function() {
        text.text = 'Player: ' + game.player.x + ', ' + game.player.y + ' Altitude: ' + game.altitude;
        scene.backgroundColor = bgcolor_lerp(game.altitude);
        var GRAVITY = 4.0 - rand(4);
        game.altitude -= 10.0;
        if(game.altitude < 0) {
            game.pushScene(createEndingScene(game));
        }
        game.player.y += GRAVITY;
    });
    scene.addEventListener('touchstart', function(e) {
	    game.touched = true;
        game.player.y -= 20.0;
    });
    scene.addEventListener('touchend', function(e) {
	    game.touched = false;
    });
    out('Player: ' + printObject(game.player));
    scene.addChild(game.player);

    var laser = new LaserBeam({x:0,y:0},{x:game.width,y:game.height},10,45);
    laser.points.forEach(function (x) {
        scene.addChild(x);
    });
    game.laser = laser;
    return scene;
}

var createSprite = function(x, y, frame, image) {
    var sprite = new Sprite(16,16);
    sprite.image = game.assets[image];
    sprite.x = x;
    sprite.y = y;
    sprite.frame = frame;
    return sprite;
}

var out = function(x) { console.log(x); }

var printObject = function (obj) {
    var tokens = Object.keys(obj).map(function (key) {
        return key + ": " + obj[key];
    });
    return '{' + tokens.join(', ') + '}'
}

var LaserBeam = function(start, end, points, frame) {
    var laserLerp = lerp(start,end);
    var delta = game.width / points;
    this.points = [];
    for(var i=0;i<points;i++) {
        var sx = i * delta;
        var sy = laserLerp(sx);
        this.points.push(createSprite(sx,sy,frame,'icon0.png'));
    }
};

function isOutOfBounds(x, y, width, height) {
    return y > game.height || x > game.width || x < -width || y < -height;
}

function rand(num){ return Math.floor(Math.random() * num) };

function colorLerp(range, startColor, endColor) {
    function channelLerp(channel) {
        return lerp({x:range.start,y:startColor[channel]},{x:range.end,y:endColor[channel]});
    }
    var r_lerp = channelLerp('red');
    var g_lerp = channelLerp('green');
    var b_lerp = channelLerp('blue');
    return function(x) {
        var r = Math.floor(r_lerp(x));
        var g = Math.floor(g_lerp(x));
        var b = Math.floor(b_lerp(x));
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    };
}

function lerp(start, end) {
    var xd = end.x - start.x;
    return function(x) {
        return start.y + (end.y - start.y) * (x - start.x)/xd;
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

function playerDead(game) {
    game.pushScene(createEndingScene(game));
}
