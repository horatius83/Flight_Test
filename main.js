enchant();
window.onload = function() {
    game = new Game(320, 320);
    game.fps = 24;
    game.enemy_speed = 1;
    game.preload('chara1.png', 'icon0.png');
    game.enemies = new Array();
    
    // Create the different scenes
    var scenes = {
	title : new Scene(),
	action: new Scene(),
	map : new Scene(),
	end : createEndingScene()
    };
    game.scenes = scenes
    scenes.title.backgroundColor = 'red';
    scenes.map.backgroundColor = 'green';
    scenes.action.backgroundColor = 'blue';
    game.pushScene(scenes.action);

    game.onload = function() {
	player = new Player(152,300);

        game.scenes.action.addEventListener('enterframe', function() {
            if(this.age % 20 == 0){
                var enemy = new Enemy(rand(320), -32);
		game.enemies.push(enemy);
            }
        });
    };
    game.start();
};

/* a level will have a series of timed triggers that summon
enemies, effects / background changes, and powerups */

function createEndingScene() {
    var endScene = new Scene();
    endScene.backgroundColor = 'black';
    var text = new Label("You have died.");
    text.color = 'red';
    text.x = 100;
    text.y = 320.0 / 2.0;
    endScene.addChild(text);
    return endScene;
}

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x,y) {
	enchant.Sprite.call(this, 16, 16);
	this.image = game.assets['icon0.png'];
	this.x = x; this.y = y;
	this.frame = 44;
	game.scenes.action.addEventListener('touchstart', function(e) {
	    player.x = e.x;
	    game.touched = true;
	});
	game.scenes.action.addEventListener('touchmove', function(e) {
	    player.x = e.x;
	});
	game.scenes.action.addEventListener('touchend', function(e) {
	    player.x = e.x;
	    game.touched = false;
	});
	this.addEventListener('enterframe', function() {
	    if(game.touched && game.frame % 3 == 0) {
		var s = new PlayerShoot(this.x,this.y);
	    }
	    for(var i in game.enemies) {
		if(game.enemies[i].intersect(this)) {
		    game.popScene();
		    game.pushScene(game.scenes.end);
		}
	    }
	});
	game.scenes.action.addChild(this);
    }
});

var Bear = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y) {
	enchant.Sprite.call(this, 32, 32);
	this.x = x;
	this.y = y;
	this.image = game.assets['chara1.png'];
	this.frame = 5;
	game.scenes.action.addChild(this);
    }
});

var Enemy = enchant.Class.create(Bear, {
    initialize: function(x, y) {
	Bear.call(this, x, y);
	this.addEventListener('enterframe', function() {
	    this.y += game.enemy_speed;
	    this.frame = [0, 1, 0, 2][Math.floor(this.age/5) % 4] + 5;
	    if(isOutOfBounds(this.x, this.y, this.width, this.height)) {
	    	this.remove();
	    }
	});
    },
    remove : function() {
	game.scenes.action.removeChild(this);
	delete this;
    }
});

var Shoot = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, direction) {
	enchant.Sprite.call(this,16,16);
	this.image = game.assets['icon0.png']
	this.x = x; this.y = y;
	this.frame = 16;
	this.direction = direction;
	this.moveSpeed = 10;
	this.addEventListener('enterframe', function () {
	    this.x += this.moveSpeed * Math.cos(this.direction);
	    this.y += this.moveSpeed * Math.sin(this.direction);
	    
	    if(isOutOfBounds(this.x, this.y, this.width, this.height)) {
		this.remove();
	    }
	});
	game.scenes.action.addChild(this);
    },
    remove: function () {
	game.scenes.action.removeChild(this);
	delete this;
    }
});

var PlayerShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y) {
	Shoot.call(this, x, y, -Math.PI/2.0);
	this.addEventListener('enterframe', function () {
	    for (var i in game.enemies) {
		if(game.enemies[i].intersect(this)) {
		    this.remove();
		    game.enemies[i].remove();
		    game.enemies.splice(i,1);
		    break;
		}
	    }
	});
    },
});
    
function isOutOfBounds(x, y, width, height) {
    return y > 320 || x > 320 || x < -width || y < -height;
}

function rand(num){ return Math.floor(Math.random() * num) };
