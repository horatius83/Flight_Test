'use strict';

// ==== (Point) ====
QUnit.test("Point.add test", function(assert) {
    var x0 = 0;
    var y0 = 0;
    var x1 = 1;
    var y1 = 1;
    var p0 = new Point(x0, y0);
    var p1 = new Point(x1, y1);
    var pr = p0.add(p1);
    assert.ok(pr.x === x0 + x1, "x values was not added");
    assert.ok(pr.y === y0 + y1, "y values was not added");
    assert.ok(p0.x === x0, 'x value should be immutable');
    assert.ok(p0.y === y0, 'y value should be immutable');
});

QUnit.test("Point.sub test", function(assert) {
    var x0 = 1;
    var y0 = -1;
    var x1 = 2;
    var y1 = 20;
    var p0 = new Point(x0, y0);
    var p1 = new Point(x1, y1);
    var pr = p0.sub(p1);
    assert.ok(pr.x === x0 - x1, "x values were not subtracted");
    assert.ok(pr.y === y0 - y1, "y values were not subtracted");
    assert.ok(p0.x === x0, 'x value should be immutable');
    assert.ok(p0.y === y0, 'y value should be immutable');
});

QUnit.test("Point.dot test", function(assert) {
    var x0 = 2;
    var y0 = 4;
    var x1 = 3;
    var y1 = 6;
    var p0 = new Point(x0, y0);
    var p1 = new Point(x1, y1);
    var d = p0.dot(p1);
    assert.ok(d === x0*x1+y0*y1, "dot product miscalculated");
    assert.ok(p0.x === x0, 'x value should be immutable');
    assert.ok(p0.y === y0, 'y value should be immutable');
});

QUnit.test("Point.scalarMul", function(assert) {
    var x = 5;
    var y = 7;
    var s = 34;
    var p = new Point(x,y);
    var r = p.scalarMul(s);
    assert.ok(r.x === x * s, "x scalar value not multiplied");
    assert.ok(r.y === y * s, "y scalar value not multiplied");
    assert.ok(p.x === x, 'x value should be immutable');
    assert.ok(p.y === y, 'y value should be immutable');
});

QUnit.test("Point.magmag", function(assert) {
    var point = new Point(10,10);
    assert.ok(200 === point.magmag(), "The square root of the magnitude expected 200, got " + point.magmag());
});

QUnit.test("Point.magnitude", function(assert) {
    var point0 = new Point(0,10.0);
    var point1 = new Point(-10.0,0);
    assert.ok(10.0 === point0.magnitude(), "Expected magnitude of 10, but got " + point0.magnitude());
    assert.ok(10.0 === point1.magnitude(), "Expected magnitude of 10, but got " + point1.magnitude());
});

QUnit.test("Point.normalized",function(assert) {
    var point0 = new Point(0,-10);
    var point1 = new Point(10,0);
    assert.ok(-1.0 === point0.normalized().y, "Normalized y-value was supposed to be -1.0, but was " + point0.normalized().y);
    assert.ok(1.0 === point1.normalized().x, "Normalized x-value was supposed to be 1.0, but was " + point1.normalized().x);
});

// ==== (Color) ====
QUnit.test("Color.toRgb", function(assert) {
    var r = 1.0;
    var g = 0.5;
    var b = 0;
    var c = new Color(r,g,b);
    var rgb = c.toRgb();
    var expectedValue = 'rgb(255,127,0)';
    assert.ok(rgb === expectedValue, 'RGB value is not correct: ' + rgb + ' === ' + expectedValue);
});

// ==== (Camera) ====
QUnit.test('Camera.MoveRelative', function(assert) {
    var x0 = 0;
    var y0 = 0;
    var x1 = 12;
    var y1 = -24;
    var direction = 0;
    var fov = 45.0;
    var camera = new Camera(new Point(x0,y0), direction, fov);
    camera.MoveRelative(new Point(x1,y1));
    assert.ok(camera.origin.x === x0 + x1, 'camera x origin is not correct');
    assert.ok(camera.origin.y === y0 + y1, 'camera y origin is not correct');
}); 

QUnit.test('Camera.Move', function(assert) {
    var x0 = 0;
    var y0 = 0;
    var x1 = 13;
    var y1 = -16;
    var direction = 90.0;
    var fov = 90.0;
    var camera = new Camera(new Point(x0,y0), direction, fov);
    camera.Move(new Point(x1,y1));
    assert.ok(camera.origin.x === x1, 'camera x origin is not correct');
    assert.ok(camera.origin.y === y1, 'camera y origin is not correct');
});

QUnit.test('Sphere.intersection trivial intersection', function(assert) {
    var rox = -10;
    var roy = 0;
    var rdx = 1;
    var rdy = 0;
    var sox = 0;
    var soy = 0;
    var radius = 2;
    var ray = new Ray(new Point(rox,roy), new Point(rdx,rdy));
    var sphere = new Sphere(new Point(sox,soy),radius,colors.red);
    var t = sphere.intersection(ray);
    assert.ok(t[0] === 8, 'sphere intersection returned ' + t + ' expected 8');
    assert.ok(t[1] === 12, 'sphere intersection returned ' + t + ' expected 12');
});
