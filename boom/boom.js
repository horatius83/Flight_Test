"strict";


Math.degToRad = function(deg) { return deg * Math.PI / 180.0 }
    
// === (Point) ===
var Point = function(x,y) {
    this.x = x;
    this.y = y;
};

Point.prototype.add = function(p) {
    return new Point(this.x + p.x, this.y + p.y);
};

Point.prototype.sub = function(p) {
    return new Point(this.x - p.x, this.y - p.y);
};

Point.prototype.dot = function(p) {
    return this.x * p.x + this.y * p.y;
};

Point.prototype.scalarMul = function(s) {
    return new Point(this.x * s, this.y * s);
};

// === (Color) ===
var Color = function(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

Color.prototype.toRgb = function() {
    var redChannel = Math.floor(this.r * 255);
    var greenChannel = Math.floor(this.g * 255);
    var blueChannel = Math.floor(this.b * 255);
    return "rgb(" + redChannel + "," + greenChannel + "," + blueChannel + ")"; 
};

var colors = {
    'red' : new Color(1.0,0,0),
    'green' : new Color(0,1.0,0),
    'blue' : new Color(0,0,1.0),
    'yellow' : new Color(1.0,1.0,0),
    'purple' : new Color(1.0,0,1.0),
    'cyan' : new Color(0,1.0,1.0)
};

// === (Camera) ===
var Camera = function(origin, direction, fov) {
    this.origin = origin;
    this.direction = direction;
    this.fov = fov;
}

Camera.prototype.MoveRelative = function(relativePos) {
    this.origin.add(relativePos);
    return this;
};

Camera.prototype.Move = function(loc) {
    this.origin = loc;
    return this;
};

// === (Ray) ===
var Ray = function(origin, vector) {
    this.origin = origin;
    this.vector = vector;
}

// === (Sphere) ===
var Sphere = function(center, radius, color) {
    this.center = center;
    this.radius = radius;
    this.color = color;
};

Sphere.prototype.intersection = function(ray) {
    var a = ray.vector.dot(ray.vector);
    var b = ray.vector.scalarMult(2).dot(ray.origin.sub(this.center));
    var c = this.center.dot(this.center) + ray.origin.dot(ray.origin) +
        (-2) * this.center.dot(ray.origin) - this.radius * this.radius;
    if(a === 0) { return undefined; };
    var t = -b - Math.sqrt(b * b - 4 * a * c) / 2 * a;
    if(t < 0) { return undefined; }
    else { return t; }
};

// === (Scene) ===
var Scene = function() {
    this.objs = [];
};

Scene.prototype.AddObj = function(obj) {
    this.objs.push(obj);
    return this;
};

Scene.prototype.castRay = function(ray) {
    var shortest = undefined;
    for(var obj in this.objs) {
        var result = objs[obj].intersection(ray);
        if(result !== undefined) {
            if(shortest == undefined) {
                shortest = [result, objs[obj]];
            } else {
                if(result < shortest[0]) {
                    shortest = [result, objs[obj]];
                }
            }
        }
    }
    return shortest;
};

screen = {
    width: 512,
    height: 512
};

var renderer = {
  drawScene : function(ctx, scene, camera) {
        // generate {width} slices, shoot out rays, get rays back, do lighting calculations
        var degsPerSlice = camera.fov / screen.width;
        var startingAngle = camera.direction - (camera.fov / 2);
        for(var i=0,angle=startingAngle; i<screen.width; i++, angle = startingAngle + degsPerSlice * i) {
            var color = new Color(Math.random(), Math.random(), Math.random());
            ctx.fillStyle = color.toRgb();
            ctx.fillRect(i,0,i+1,screen.height);               
        } 
    }
};

function drawScene() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var camera = new Camera(new Point(0,0), new Point(0,1), 90);
    var scene = new Scene();

    renderer.drawScene(ctx, scene, camera);
}
