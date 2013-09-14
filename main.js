enchant();
window.onload = function() {
    game = new Game(320, 320);
    game.fps = 24;
    game.enemy_speed = 1;
    game.preload('chara1.png', 'icon0.png');
    game.enemies = new Array();
    
    game.pushScene(createTitleScene(game)); 
    game.start();
};

function playerDead(game) {
    game.pushScene(createEndingScene(game));
}

/* a level will have a series of timed triggers that summon
enemies, effects / background changes, and powerups */
function createActionScene(game) {
    var scene = new Scene();
    scene.backgroundColor = 'blue';
   
    player = new Player(152,300);
    game.player = player;
    scene.addEventListener('enterframe', function() {
	// Spawn enemies
	if(this.age % 20 == 0) {
	    var enemy = new Enemy(rand(320), -32, scene);
	    game.enemies.push(enemy);
	}

	// Handle player
	if(game.touched && game.frame % 3 == 0) {
	    var s = new PlayerShoot(player.x, player.y, scene);
	}
	for(var i in game.enemies) {
	    if(game.enemies[i].intersect(player)) {
		playerDead(game);
	    }
	}
    });
    scene.addEventListener('touchstart', function(e) {
	player.x = e.x;
	game.touched = true;
    });
    scene.addEventListener('touchmove', function(e) {
	player.x = e.x;
    });
    scene.addEventListener('touchend', function(e) {
	player.x = e.x;
	game.touched = false;
    });
    scene.addChild(player);
    return scene;
}

function createEndingScene(game) {
    var endScene = new Scene();
    endScene.backgroundColor = 'black';
    var text = new Label("You have died.");
    text.color = 'red';
    text.x = 100;
    text.y = 320.0 / 2.0;
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
    text.y = 320.0 / 2.0;
    titleScene.addChild(text);
    
    titleScene.addEventListener('touchstart', function(e) {
	game.pushScene(createActionScene(game));
    });
    return titleScene;
}

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x,y) {
	enchant.Sprite.call(this, 16, 16);
	this.image = game.assets['icon0.png'];
	this.x = x; this.y = y;
	this.frame = 44;
    }
});

var Bear = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, scene) {
	enchant.Sprite.call(this, 32, 32);
	this.x = x;
	this.y = y;
	this.image = game.assets['chara1.png'];
	this.frame = 5;
	scene.addChild(this);
    }
});

var Enemy = enchant.Class.create(Bear, {
    initialize: function(x, y, scene) {
	Bear.call(this, x, y, scene);
	this.scene = scene;
	this.firstFrame = game.frame;
	this.addEventListener('enterframe', function() {
	    this.y += game.enemy_speed;
	    this.x = x + Math.sin(this.age);
	    this.frame = [0, 1, 0, 2][Math.floor(this.age/5) % 4] + 5;
	    if(isOutOfBounds(this.x, this.y, this.width, this.height)) {
	    	this.remove();
	    }
	    if((game.frame + this.firstFrame) % 30 === 0) {
		var s = new EnemyShoot(this.x, this.y, scene);
	    }
	});
    },
    remove : function() {
	this.scene.removeChild(this);
	delete this;
    }
});

var Shoot = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, direction, scene) {
	enchant.Sprite.call(this,16,16);
	this.image = game.assets['icon0.png']
	this.x = x; this.y = y;
	this.frame = 16;
	this.direction = direction;
	this.moveSpeed = 10;
	this.scene = scene;
	this.addEventListener('enterframe', function () {
	    this.x += this.moveSpeed * Math.cos(this.direction);
	    this.y += this.moveSpeed * Math.sin(this.direction);
	    
	    if(isOutOfBounds(this.x, this.y, this.width, this.height)) {
		this.remove();
	    }
	});
	scene.addChild(this);
    },
    remove: function () {
	if(this.scene !== null) {
	    this.scene.removeChild(this);
	}
	delete this;
    }
});

var PlayerShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y, scene) {
	Shoot.call(this, x, y, -Math.PI/2.0, scene);
	this.frame = 48;
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
    
var EnemyShoot = enchant.Class.create(Shoot, {
    initialize: function(x, y, scene) {
	Shoot.call(this, x, y, Math.PI/2.0, scene);
	this.frame = 60;
	this.addEventListener('enterframe', function() {
	    if(game.player.intersect(this)) {
		playerDead(game);
	    }
	});
    }
});

function isOutOfBounds(x, y, width, height) {
    return y > 320 || x > 320 || x < -width || y < -height;
}

function rand(num){ return Math.floor(Math.random() * num) };
