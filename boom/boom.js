"strict";

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

Math.degToRad = function(deg) { return deg * Math.PI / 180.0 }

var makePoint = function(x,y) {
    return {
        'x' : x, 
        'y' : y,
        add : function(x,y) {
            this.x += x;
            this.y += y;
        }
    };
};

var makeColor = function(r,g,b) {
    'r' : r,
    'g' : g,
    'b' : b
};

var camera = {
    point : makePoint(0,0),
    direction : 90.0,
    fov : 90.0,

    move : function(x,y) {
        point.add(x,y);
    }
};

screen = {
    width: 512,
    height: 512
};

var scene  = (function() {
    var objs = [];
    return {
        addObj : function(obj) {
            objs.push(obj)
        },
        castRay : function(ray) {
            var shortest = undefined;
            for(var obj in objs) {
                var result = objs[obj].intersection(ray);
                if(result !== undefined) {
                    if(shortest == undefined) {
                        shortest = [result, objs[obj]];
                    } else {
                        if(result < shortest) {
                            shortest = [result, objs[obj]];
                        }
                    }
                }
            }
            return shortest[1];
        }
    }})();
    

var renderer = {
  drawScene : function(camera, scene, screen) {
        // generate {width} slices, shoot out rays, get rays back, do lighting calculations
        var degsPerSlice = camera.fov / screen.width;
        var startingAngle = camera.direction - (camera.fov / 2);
        for(var i=0,angle=startingAngle; i<screen.width; i++, angle = startingAngle + degsPerSlice * i) {
            
        } 
    }  
