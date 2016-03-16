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
    assert.ok(pr.x === x0 + x1, "x values added");
    assert.ok(pr.y === y0 + y1, "y values added");
});

QUnit.test("Point.sub test", function(assert) {
    var x0 = 1;
    var y0 = -1;
    var x1 = 2;
    var y1 = 20;
    var p0 = new Point(x0, y0);
    var p1 = new Point(x1, y1);
    var pr = p0.sub(p1);
    assert.ok(pr.x === x0 - x1, "x values subtracted");
    assert.ok(pr.y === y0 - y1, "y values subtracted");
});

QUnit.test("Point.dot test", function(assert) {
    var x0 = 2;
    var y0 = 4;
    var x1 = 3;
    var y1 = 6;
    var p0 = new Point(x0, y0);
    var p1 = new Point(x1, y1);
    var d = p0.dot(p1);
    assert.ok(d === x0*x1+y0*y1, "dot product calculated");
});

QUnit.test("Point.scalarMul", function(assert) {
    var x = 5;
    var y = 7;
    var s = 34;
    var p = new Point(x,y);
    var r = p.scalarMul(s);
    assert.ok(r.x === x * s, "x scalar value multiplied");
    assert.ok(r.y === y * s, "y scalar value multiplied");
});

// ==== (Color) ====
QUnit.test("Color.toRgb", function(assert) {
});
