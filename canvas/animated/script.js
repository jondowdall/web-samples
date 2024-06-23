
/**
 *
 */
const app = {
    point: {
        x: 100,
        y: 100,
    },
    radius: 5,
    shapes: [],
}

function message(text) {
    const overlay = document.getElementById('overlay');
    overlay.innerText = text;
}


function mouseMove(event) {
    event.preventDefault();
    const box = event.target.getBoundingClientRect();
    /*
    app.shapes[0].position.x = event.clientX - box.x;
    app.shapes[0].position.y = event.clientY - box.y;
    */
    message(`${app.shapes[0].position.x}, ${app.shapes[0].position.x}`);
}

function touchMove(event) {
    event.preventDefault();
    const box = event.target.getBoundingClientRect();
    app.shapes[0].shape1.position.x = event.touches[0].clientX - box.x;
    app.shapes[0].shape1.position.y = event.touches[0].clientY - box.y;

    message(`${app.shapes[0].position.x}, ${app.shapes[0].position.x}`);
}

function touchEnd(event) {
    event.preventDefault();
    render();
}

function click(event) {
    event.preventDefault();
    render();
}

class vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new vec2(this.x, this.y);
    }
    get length() {
        return Math.hypot(this.x, this.y);
    }
    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    scaled(s) {
        return new vec2(this.x * s, this.y * s);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    inc(s) {
        this.x += s;
        this.y += s;
        return this;
    }
    plus(v) {
        return new vec2(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    dec(s) {
        this.x -= s;
        this.y -= s;
        return this;
    }
    minus(v) {
        return new vec2(this.x - v.x, this.y - v.y);
    }
    max(s) {
        this.x = Math.max(this.x, s);
        this.y = Math.max(this.y, s);
        return this;
    }
    min(s) {
        this.x = Math.min(this.x, s);
        this.y = Math.min(this.y, s);
        return this;
    }
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
}


class vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    clone() {
        return new vec3(this.x, this.y, this.z);
    }
    get length() {
        return Math.hypot(this.x, this.y, this.z);
    }
    normalise() {
        const length = this.length;
        this.x /= length;
        this.y /= length;
        this.z /= length;
        return this;
    }
    transform(matrix) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        this.x = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
        this.y = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
        this.z = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
        return this;
    }
    get xy() {
        return new vec2(this.x, this.y);
    }
    get xz() {
        return new vec2(this.x, this.z);
    }
    get yz() {
        return new vec2(this.y, this.z);
    }
    cross(v) {
        return new vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    scale(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
    scaled(s) {
        return new vec3(this.x * s, this.y * s, this.z * s);
    }
    dot2() {
        return this.dot(this);
    }
    ndot() {
        return this.x * v.x - this.y * v.y;
    }
    iabs() {
        const result = this.clone();
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        this.z = Math.abs(this.z);
        return this;
    }
    abs() {
        return this.clone().iabs();
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    inc(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    }
    plus(v) {
        return new vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    dec(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    }
    minus(v) {
        return new vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    min(s) {
        this.x = Math.min(this.x, s);
        this.y = Math.min(this.y, s);
        this.z = Math.min(this.z, s);
        return this;
    }
    max(s) {
        this.x = Math.max(this.x, s);
        this.y = Math.max(this.y, s);
        this.z = Math.max(this.z, s);
        return this;
    }
}

/**
 * Invert a 3x3 matrix
 */
function invert3x3(input) {
    const a00 = input[0], a01 = input[1], a02 = input[2];
    const a10 = input[3], a11 = input[4], a12 = input[5];
    const a20 = input[6], a21 = input[7], a22 = input[8];

    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;
    // Calculate the determinant
    const det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) {
        return null;
    }
    const idet = 1.0 / det;
    return [
        b01 * idet,
        (-a22 * a01 + a02 * a21) * idet,
        (a12 * a01 - a02 * a11) * idet,
        b11 * idet,
        (a22 * a00 - a02 * a20) * idet,
        (-a12 * a00 + a02 * a10) * idet,
        b21 * idet,
        (-a21 * a00 + a01 * a20) * idet,
        (a11 * a00 - a01 * a10) * idet];
}


function getRotationMatrix(axis, angle) {
    const v = axis.clone().normalise();

    const a = Math.cos(angle / 2);
    const b = Math.sin(angle / 2) * v.x;
    const c = Math.sin(angle / 2) * v.y;
    const d = Math.sin(angle / 2) * v.z;

    return [a * a + b * b - c * c - d * d, 2 * (b * c - a * d), 2 * (b * d + a * c), 0,
    2 * (b * c + a * d), a * a - b * b + c * c - d * d, 2 * (c * d - a * b), 0,
    2 * (b * d - a * c), 2 * (c * d + a * b), a * a - b * b - c * c + d * d, 0,
        0, 0, 0, a * a + b * b + c * c + d * d];
}

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);

}

function length(v) {
    return Math.hypot(v.x, v.y, v.z);
}

function abs(v) {
    return {
        x: Math.abs(v.x),
        y: Math.abs(v.y),
        z: Math.abs(v.z),
    }
}

function add(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z,
    }
}

function inc(v1, s) {
    return {
        x: v1.x + s,
        y: v1.y + s,
        z: v1.z + s,
    }
}

function subtract(v1, v2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z,
    }
}

function dec(v1, s) {
    return {
        x: v1.x - s,
        y: v1.y - s,
        z: v1.z - s,
    }
}

function min(v, s) {
    return {
        x: Math.min(v.x, s),
        y: Math.min(v.y, s),
        z: Math.min(v.z, s),
    }
}

function max(v, s) {
    return {
        x: Math.max(v.x, s),
        y: Math.max(v.y, s),
        z: Math.max(v.z, s),
    }
}

function randomChoice(options) {
    return options[Math.floor(Math.random() * options.length)];
}

class SDFShape {
    constructor(position, axis, angle) {
        this.hue = 360 * Math.random();
        this.saturation = 100 * Math.random();
        this.lightness = 100 * Math.random();
        
        this.position = position;// ?? new vec3();
        axis = axis ?? new vec3(Math.random(), Math.random(), Math.random());
        angle = angle ?? Math.random() * 2 * Math.PI;
        this.transform = getRotationMatrix(axis, angle);
    }
    getColour(point) {
        const lightness = this.lightness * normal(point, this).dot(app.light);
        return `hsl(${this.hue} ${this.saturation}% ${lightness}%)`;
    }
    local(point) {
        return point.clone().transform(this.transform).subtract(this.position);
    }
    update(time) { }
}

class Ball extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const radius = canvas.clientWidth * (1 + Math.random()) / 10;
        return new Ball(position, radius);
    }
    constructor(position, radius) {
        super();
        this.position = position;
        this.radius = radius;
    }
    dist(point) {
        return point.clone().subtract(this.position).length - this.radius;
    }
}

class BobbleBall extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const radius = canvas.clientWidth * (1 + Math.random()) / 10;
        return new BobbleBall(position, radius);
    }
    constructor(position, radius) {
        super();
        this.position = position;
        this.baseRadius = radius;
        this.offset = 1 + Math.random();
    }
    dist(point) {
        return point.clone().subtract(this.position).length - this.radius;
    }
    update(time) {
        this.radius = this.baseRadius * (1.5 + Math.sin(this.offset * time / 1000));
    }
}

class Box extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const size = new vec3(
            Math.random() * canvas.clientWidth / 5,
            Math.random() * canvas.clientHeight / 5,
            Math.random() * canvas.clientWidth / 5);
        const radius = Math.random() * 25;
        return new Box(position, size, radius);
    }
    constructor(position, size, radius) {
        super(position);
        this.size = size;
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
        const q = p.abs().subtract(this.size).inc(this.radius);
        return q.max(0).length + Math.min(Math.max(q.x, q.y, q.z), 0) - this.radius;
    }
    update(time) {

    }
}

class BoxFrame extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const size = new vec3(
            Math.random() * canvas.clientWidth / 5,
            Math.random() * canvas.clientHeight / 5,
            Math.random() * canvas.clientWidth / 5);
        const e = 5 + Math.random() * 25;
        const radius = Math.random() * 25;
        return new BoxFrame(position, size, e, radius);
    }
    constructor(position, size, e, radius) {
        super(position);
        this.size = size;
        this.e = e;
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point).abs().subtract(this.size);
        const q = p.clone().inc(this.e).iabs().dec(this.e);

        return Math.min(
            length(inc(max({ x: p.x, y: q.y, z: q.z }, 0), Math.min(Math.max(p.x, q.y, q.z), 0))),
            length(inc(max({ x: q.x, y: p.y, z: q.z }, 0), Math.min(Math.max(q.x, p.y, q.z), 0))),
            length(inc(max({ x: q.x, y: q.y, z: p.z }, 0), Math.min(Math.max(q.x, q.y, p.z), 0)))) - this.radius;
    }
}


class Torus extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const radius = Math.random() * 25;
        const size = radius + Math.random() * 100
        return new Torus(position, size, radius);
    }
    constructor(position, size, radius) {
        super(position);
        this.size = size;
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
        const q = new vec2(p.xz.length - this.size , p.y);
        return q.length - this.radius;
    }
}

/*
 * Capped Torus - exact   (https://www.shadertoy.com/view/tl23RK)
 */
class CappedTorus extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const radius = Math.random() * 25;
        const size = radius + Math.random() * 100;
        const angle = Math.random() * 360;
        return new CappedTorus(position, size, radius, angle);
    }
    constructor(position, size, radius, spanAngle) {
        super(position);
        this.size = size;
        this.radius = radius;
        this.sin = Math.sin(spanAngle * Math.PI / 180);
        this.cos = Math.cos(spanAngle * Math.PI / 180);
    }
    dist(point) {
        const p = this.local(point);
        p.x = Math.abs(p.x);
        const k = (this.cos * p.x > this.sin * p.y) ? p.x * this.sin + p.y * this.cos : p.xy.length;
        return Math.sqrt( p.dot(p) + this.size * this.size - 2.0 * this.size * k) - this.radius;
    }
}

/*
 * Link - exact   (https://www.shadertoy.com/view/wlXSD7)
 */
class Link extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const radius = Math.random() * 25;
        const size = radius + Math.random() * 100;
        const length = radius + Math.random() * canvas.clientWidth;
        return new Link(position, length, size, radius);
    }
    constructor(position, length, size, radius) {
        super(position);
        this.size = size;
        this.radius = radius;
        this.length = length;
    }
    dist(point) {
        const p = this.local(point);
        const q = new vec3(p.x, Math.max(Math.abs(p.y) - this.length, 0), p.z);
        return (new vec2(q.xy.length - this.size, q.z)).length - this.radius;
    }
}

/*
 * Infinite Cylinder - exact
 */
class Cylinder extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const radius = Math.random() * 25;
        return new Cylinder(position, radius);
    }
    constructor(position, radius) {
        super(position);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
        return p.xy.length - this.radius;
    }
}

/*
 * Cone - exact
 */
class Cone extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const height = Math.random() * canvas.clientWidth;
        const angle = 1 + Math.random() * 88;
        return new Cone(position, height, angle);
    }
    constructor(position, height, coneAngle) {
        super(position);
        this.height = height;
        this.sin = Math.sin(coneAngle * Math.PI / 180);
        this.cos = Math.cos(coneAngle * Math.PI / 180);
    }
    dist(point) {
        const p = this.local(point);

        // c is the sin/cos of the angle, h is height
        // Alternatively pass q instead of (c,h),
        // which is the point at the base in 2D
        const q = new vec2(this.sin / this.cos, -1).scale(this.height);
        
        const w = new vec2(p.xz.length, p.y);
        const scale = clamp( w.dot(q) / q.dot(q), 0.0, 1.0);
        const a = new vec2(w.x - q.x * scale, w.y - q.y * scale);
        const b = new vec2(w.x - q.x * clamp( w.x / q.x, 0.0, 1.0 ),  w.y - q.y);
        const k = Math.sign(q.y);
        const d = Math.min(a.dot(a), b.dot(b));
        const s = Math.max( k*(w.x*q.y-w.y*q.x),k*(w.y-q.y)  );
        return Math.sqrt(d) * Math.sign(s);
    }
}

/*


Cone - bound (not exact!)

float sdCone( vec3 p, vec2 c, float h )
{
  float q = length(p.xz);
  return max(dot(c.xy,vec2(q,p.y)),-h-p.y);
}

/*
 * Infinite Cone - exact
 */
class InfiniteCone extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const angle = 1 + Math.random() * 88;
        return new Cone(position, angle);
    }
    constructor(position, coneAngle) {
        super(position);
        this.sin = Math.sin(coneAngle * Math.PI / 180);
        this.cos = Math.cos(coneAngle * Math.PI / 180);
    }
    dist(point) {
        const p = this.local(point);
        const q = new vec2(p.xz.length, -p.y);
        const scale = Math.max(q.x * this.sin + q.y * this.cos, 0.0);
        const d = new vec2(q.x - c.x * scale, q.y - c.y * scale).length;
        return d * ((q.x * c.y - q.y * c.x < 0.0) ? -1.0 : 1.0);
    }
}

/*
 * Plane - exact
 */
class Plane extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const normal = new vec3(Math.random(), Math.random(), Math.random());
        return new Plane(position, normal);
    }
    constructor(position, normal) {
        super(position);
        this.normal = normal.clone().normalise();
    }
    dist(point) {
        const p = this.local(point).normalise();
        return p.dot(this.normal);
    }
}

/*
 * Hexagonal Prism - exact
 */
class HexPrism extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const radius = 0.5 * canvas.clientWidth * Math.random();
        const height = 0.5 * canvas.clientWidth * Math.random();
        return new HexPrism(position, radius, height);
    }
    constructor(position, radius, height) {
        super(position);
        this.radius = radius;
        this.height = height;
    }
    dist(point) {
        const p = this.local(point).abs();

        const k = new vec3(-0.8660254, 0.5, 0.57735);
        const scale = 2 * Math.min(k.x * p.x + k.y * p.y, 0);
        p.x -= scale * k.x;
        p.y -= scale * k.y;
 
        const limit = clamp(p.x, -k.z * this.radius, k.z * this.radius);
        const d = new vec2((new vec2(p.x - limit, p.y - this.radius)).length * Math.sign(p.y - this.radius), p.z - this.height);
        
        return Math.min(Math.max(d.x, d.y), 0) + d.max(0).length;
    }
}

/*
 * Triangular Prism - bound
 */
class TriangularPrism extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
        const radius = 0.5 * canvas.clientWidth * Math.random();
        const height = 0.5 * canvas.clientWidth * Math.random();
        return new TriangularPrism(position, radius, height);
    }
    constructor(position, radius, height) {
        super(position);
        this.radius = radius;
        this.height = height;
    }
    dist(point) {
        const p = this.local(point);
        const q = p.clone().abs();
        return Math.max(q.z - this.height, Math.max(q.x * 0.866025 + p.y * 0.5, -p.y) - this.radius * 0.5);
    }
}

/*
 * Capsule / Line - exact
 */
class Capsule extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);

        const start = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 2);
        const end = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 2);

        const radius = 0.5 * canvas.clientWidth * Math.random();
                    
        return new Capsule(position, start, end, radius);
        
    }
    constructor(position, start, end, radius) {
        super(position);
        this.start = start;
        this.end = end;
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
        const pa = p.clone().subtract(this.start);
        const ba = this.end.clone().subtract(this.start);
        const h = clamp(pa.dot(ba) / ba.dot(ba), 0.0, 1.0 );
        return pa.subtract(ba.scale(h)).length - this.radius;
    }
}
/*
 * Capsule / Line - exact
 */
class VerticalCapsule extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);

        const length = 0.5 * canvas.clientWidth * Math.random();
        const radius = 0.5 * canvas.clientWidth * Math.random();
                    
        return new VerticalCapsule(position, length, radius);
        
    }
    constructor(position, length, radius) {
        super(position);
        this.length = length;
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
        p.y -= clamp( p.y, 0.0, this.length );
        return p.length - this.radius;
    }
}

/*
 * Vertical Capped Cylinder - exact   (https://www.shadertoy.com/view/wdXGDr)
 */
class CappedCylinder extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const length = 0.2 * canvas.clientWidth * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
                    
        return new CappedCylinder(position, length, radius);
        
    }
    constructor(position, length, radius) {
        super(position);
        this.length = length;
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
        const d = new vec2(p.xz.length, p.y).abs().subtract(new vec2(this.radius, this.length));
        return Math.min(Math.max(d.x, d.y), 0) + d.max(0).length;
    }
}

/*
 * Arbitrary Capped Cylinder - exact   (https://www.shadertoy.com/view/wdXGDr)
 */
class ArbitraryCappedCylinder extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const start = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 2);
        const end = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 2);
        const radius = 0.4 * canvas.clientWidth * Math.random();
                    
        return new ArbitraryCappedCylinder(position, start, end, radius);
        
    }
    constructor(position, start, end, radius) {
        super(position);
        this.start = start;
        this.end = end;
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);

        const ba = this.end.clone().subtract(this.start);
        const pa = p.clone().subtract(this.start);
        const baba = ba.dot(ba);
        const paba = pa.dot(ba);
        const x = pa.clone().scale(baba).subtract(ba.clone().scale(paba)).length - this.radius * baba;
        const y = Math.abs(paba - baba * 0.5) - baba * 0.5;
        const x2 = x * x;
        const y2 = y * y * baba;
        const d = (Math.max(x, y) < 0.0) ? -Math.min(x2, y2) : (((x > 0) ? x2 : 0) + ((y > 0) ? y2 : 0));
        return Math.sign(d) * Math.sqrt(Math.abs(d)) / baba;
    }
}

/*
 * Rounded Cylinder - exact
 */
class RoundedCylinder extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const length = 0.4 * canvas.clientWidth * Math.random();
        const radius1 = 0.4 * canvas.clientWidth * Math.random();
        const radius2 = radius1 * Math.random();
                    
        return new RoundedCylinder(position, length, radius1, radius2);
        
    }
    constructor(position, length, radius1, radius2) {
        super(position);
        this.length = length;
        this.radius1 = radius1;
        this.radius2 = radius2;
    }
    dist(point) {
        const p = this.local(point);        
        const d = new vec2(p.xz.length - 2.0 * this.radius1 + this.radius2, Math.abs(p.y) - this.length);
        return Math.min(Math.max(d.x, d.y), 0) + d.max(0).length - this.radius2;
    }
}

/*
 * Capped Cone - exact
 */
class CappedCone extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const height = 0.4 * canvas.clientWidth * Math.random();
        const radius1 = 0.4 * canvas.clientWidth * Math.random();
        const radius2 = 0.4 * canvas.clientWidth * Math.random();
                    
        return new CappedCone(position, height, radius1, radius2);
        
    }
    constructor(position, height, radius1, radius2) {
        super(position);
        this.height = height;
        this.radius1 = radius1;
        this.radius2 = radius2;
    }
    dist(point) {
        const p = this.local(point);
        const q = new vec2(p.xz.length, p.y);
        const k1 = new vec2(this.radius2, this.height);
        const k2 = new vec2(this.radius2 - this.radius1, 2 * this.height);
        const ca = new vec2(q.x - Math.min(q.x, (q.y < 0) ? this.radius1:this.radius2), Math.abs(q.y) - this.height);
        const cb = q.clone().subtract(k1).add(k2.scale(clamp(k1.clone().subtract(q).dot(k2) / k2.dot(k2), 0.0, 1.0)));
        const s = (cb.x < 0 && ca.y < 0) ? -1.0 : 1.0;
        return s * Math.sqrt( Math.min(ca.dot(ca),cb.dot(cb)));
    }
}

/*
 * Capped Cone - exact   (https://www.shadertoy.com/view/tsSXzK)
 */
class ArbitaryCappedCone extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const start = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 2);
        const end = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 2);
            
        const radius1 = 0.4 * canvas.clientWidth * Math.random();
        const radius2 = 0.4 * canvas.clientWidth * Math.random();
                    
        return new ArbitaryCappedCone(position, start, end, radius1, radius2);
        
    }
    constructor(position, start, end, radius1, radius2) {
        super(position);
        this.start = start;
        this.end = end;
        this.radius1 = radius1;
        this.radius2 = radius2;
    }
    dist(point) {
        const p = this.local(point);

        const rba  = this.radius2 - this.radius1;
        const baba = this.end.minus(this.start).dot2();
        const papa = p.minus(this.start).dot2();
        const paba = p.minus(this.start).dot(this.end.minus(this.start)) / baba;
        const x = Math.sqrt(papa - paba * paba * baba);
        const cax = Math.max(0, x - ((paba < 0.5) ? this.radius1 : this.radius2));
        const cay = Math.abs(paba - 0.5) - 0.5;
        const k = rba * rba + baba;
        const f = clamp((rba * (x - this.radius1) + paba * baba) / k, 0.0, 1.0);
        const cbx = x - this.radius1 - f * rba;
        const cby = paba - f;
        const s = (cbx < 0.0 && cay < 0.0) ? -1.0 : 1.0;
        return s * Math.sqrt( Math.min(cax * cax + cay * cay * baba, cbx * cbx + cby * cby * baba) );
    }
}

/*
 * Solid Angle - exact   (https://www.shadertoy.com/view/wtjSDW)
 */
class SolidAngle extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new SolidAngle(position, angle, radius);
        
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);

        const q = new vec2(p.xz.length, p.y );
        const l = q.length - this.radius;
        const limit = clamp(q.x * this.sin + q .y * this.cos, 0, this.radius);
        const m = new vec2(q.x - this.sin * limit, q.y - this.cos * limit).length;
        return Math.max(l, m * Math.sign(this.cos * q.x - this.sin * q.y));
    }
}

/*
Cut Sphere - exact   (https://www.shadertoy.com/view/stKSzc)
 */
class CutSphere extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);

        const radius = 0.4 * canvas.clientWidth * Math.random();
        const height = radius * Math.random();
        
        return new CutSphere(position, height, radius);
    }
    constructor(position, height, radius) {
        super(position);
        this.height = height;
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);

        // sampling independent computations (only depend on shape)
        const w = Math.sqrt(this.radius * this.radius - this.height * this.height);
        
        // sampling dependant computations
        const q = new vec2(p.xz.length, p.y );
        const s = Math.max( (this.height - this.radius) * q.x * q.x + w * w * (this.height + this.radius - 2 * q.y), this.height * q.x - w * q.y);

        return (s < 0) ? q.length - this.radius : (q.x < w) ? this.height - q.y : q.minus(new vec2(w, this.height)).length;
    }
}

/*
 * Cut Hollow Sphere - exact   (https://www.shadertoy.com/view/7tVXRt)
 */
class CutHollowSphere extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const radius = 0.4 * canvas.clientWidth * Math.random();
        const height = radius * Math.random();
        const thickness = radius * Math.random();
        
        return new CutHollowSphere(position, height, radius, thickness);
    }
    constructor(position, height, radius, thickness) {
        super(position);
        this.height = height;
        this.radius = radius;
        this.thickness = thickness;
    }
    dist(point) {
        const p = this.local(point);

        // sampling independent computations (only depend on shape)
        const w = Math.sqrt(this.radius * this.radius - this.height * this.height);
        
        // sampling dependant computations
        const q = new vec2(p.xz.length, p.y);
        
        return ((this.height * q.x < w * q.y) ? q.minus(new vec2(w, this.height)).length : Math.abs(q.length - this.radius)) - this.thickness;
    }
}

/*
 * Death Star - exact   (https://www.shadertoy.com/view/7lVXRt)
 */
class DeathStar extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const radius1 = 0.4 * canvas.clientWidth * Math.random();
        const radius2 = radius1 * Math.random();
        const depth = radius2 * Math.random();
        
        return new DeathStar(position, radius1, radius2, depth);
    }
    constructor(position, radius1, radius2, depth) {
        super(position);
        this.radius1 = radius1;
        this.radius2 = radius2;
        this.depth = depth;
    }
    dist(point) {
        const p = this.local(point);

        // sampling independent computations (only depend on shape)
        const a = (this.radius1 * this.radius1 - this.radius2 * this.radius2 + this.depth * this.depth) / (2 * this.depth);
        const b = Math.sqrt(Math.max(this.radius1 * this.radius1 - a * a, 0));
        
        // sampling dependant computations
        const q = new vec2(p.x, p.yz.length);
        if ((q.x * b - q.y * a) > (this.depth * Math.max(b - q.y, 0))) {
            return q.minus(new vec2(a, b)).length;
        }
        return Math.max(q.length - this.radius1, this.radius2 - q.minus(new vec2(this.depth, 0)).length);
    }
}

/*
 * Round cone - exact
 */
class RoundCone extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const height = 0.4 * canvas.clientWidth * Math.random();
        const radius1 = 0.4 * canvas.clientWidth * Math.random();
        const radius2 = 0.4 * canvas.clientWidth * Math.random();
        
        return new RoundCone(position, height, radius1, radius2);
    }
    constructor(position, height, radius1, radius2) {
        super(position);
        this.height = height;
        this.radius1 = radius1;
        this.radius2 = radius2;
    }
    dist(point) {
        const p = this.local(point);
        //float sdRoundCone( vec3 p, float r1, float r2, float h )

        // sampling independent computations (only depend on shape)
        const b = (this.radius1 - this.radius2) / this.height;
        const a = Math.sqrt(1 - b * b);
        
        // sampling dependant computations
        const q = new vec2(p.xz.length, p.y);
        const k = q.dot(new vec2(-b, a));
        if (k < 0 ) {
            return q.length - this.radius1;
        }
        if (k > a * this.height) {
            return q.minus(new vec2(0, this.height)).length - this.radius2;
        }
        return q.dot(new vec2(a, b)) - this.radius1;
    }
}

/*
 * Round Cone - exact   (https://www.shadertoy.com/view/tdXGWr)
 */
class ArbitaryRoundCone extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new ArbitaryRoundCone(position, angle, radius);
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
/*

float sdRoundCone( vec3 p, vec3 a, vec3 b, float r1, float r2 )
{
  // sampling independent computations (only depend on shape)
  vec3  ba = b - a;
  float l2 = dot(ba,ba);
  float rr = r1 - r2;
  float a2 = l2 - rr*rr;
  float il2 = 1.0/l2;
    
  // sampling dependant computations
  vec3 pa = p - a;
  float y = dot(pa,ba);
  float z = y - l2;
  float x2 = dot2( pa*l2 - ba*y );
  float y2 = y*y*l2;
  float z2 = z*z*l2;

  // single square root!
  float k = sign(rr)*rr*rr*x2;
  if( sign(z)*a2*z2>k ) return  sqrt(x2 + z2)        *il2 - r2;
  if( sign(y)*a2*y2<k ) return  sqrt(x2 + y2)        *il2 - r1;
                        return (sqrt(x2*a2*il2)+y*rr)*il2 - r1;
                        */
}
}

/*
Ellipsoid - bound (not exact!)   (https://www.shadertoy.com/view/tdS3DG)
 */
class Ellipsoid extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new CutSphere(position, angle, radius);
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
/*

float sdEllipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
  */
}
}

/*
Revolved Vesica - exact)   (https://www.shadertoy.com/view/Ds2czG)
 */
class RevolvedVesica extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new RevolvedVesica(position, angle, radius);
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
/*

float sdVesicaSegment( in vec3 p, in vec3 a, in vec3 b, in float w )
{
    vec3  c = (a+b)*0.5;
    float l = length(b-a);
    vec3  v = (b-a)/l;
    float y = dot(p-c,v);
    vec2  q = vec2(length(p-c-y*v),abs(y));
    
    float r = 0.5*l;
    float d = 0.5*(r*r-w*w)/w;
    vec3  h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
 
    return length(q-h.xy) - h.z;
    */
}
}

/*
 * Rhombus - exact   (https://www.shadertoy.com/view/tlVGDc)
 */
class Rhombus extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new Rhombus(position, angle, radius);
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
/*
float sdRhombus( vec3 p, float la, float lb, float h, float ra )
{
  p = abs(p);
  vec2 b = vec2(la,lb);
  float f = clamp( (ndot(b,b-2.0*p.xz))/dot(b,b), -1.0, 1.0 );
  vec2 q = vec2(length(p.xz-0.5*b*vec2(1.0-f,1.0+f))*sign(p.x*b.y+p.z*b.x-b.x*b.y)-ra, p.y-h);
  return min(max(q.x,q.y),0.0) + length(max(q,0.0));
  */
}
}

/*
 * Octahedron - exact   (https://www.shadertoy.com/view/wsSGDG)
 */
class Octahedron extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new Octahedron(position, angle, radius);
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
/*
float sdOctahedron( vec3 p, float s )
{
  p = abs(p);
  float m = p.x+p.y+p.z-s;
  vec3 q;
       if( 3.0*p.x < m ) q = p.xyz;
  else if( 3.0*p.y < m ) q = p.yzx;
  else if( 3.0*p.z < m ) q = p.zxy;
  else return m*0.57735027;
    
  float k = clamp(0.5*(q.z-q.y+s),0.0,s); 
  return length(vec3(q.x,q.y-s+k,q.z-k)); 
  */
}
}

/*
 * Octahedron - bound (not exact)
 */
class BoundOctahedron extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new BoundOctahedron(position, angle, radius);
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
/*

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
  */
}
}

/*
 * Pyramid - exact   (https://www.shadertoy.com/view/Ws3SDl)
 */
class Pyramid extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new Pyramid(position, angle, radius);
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
/*

float sdPyramid( vec3 p, float h )
{
  float m2 = h*h + 0.25;
    
  p.xz = abs(p.xz);
  p.xz = (p.z>p.x) ? p.zx : p.xz;
  p.xz -= 0.5;

  vec3 q = vec3( p.z, h*p.y - 0.5*p.x, h*p.x + 0.5*p.y);
   
  float s = max(-q.x,0.0);
  float t = clamp( (q.y-0.5*p.z)/(m2+0.25), 0.0, 1.0 );
    
  float a = m2*(q.x+s)*(q.x+s) + q.y*q.y;
  float b = m2*(q.x+0.5*t)*(q.x+0.5*t) + (q.y-m2*t)*(q.y-m2*t);
    
  float d2 = min(q.y,-q.x*m2-q.y*0.5) > 0.0 ? 0.0 : min(a,b);
    
  return sqrt( (d2+q.z*q.z)/m2 ) * sign(max(q.z,-p.y));
*/
}
}

/*
 * Triangle - exact   (https://www.shadertoy.com/view/4sXXRN)
 */
class Triangle extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new Triangle(position, angle, radius);
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
/*

float udTriangle( vec3 p, vec3 a, vec3 b, vec3 c )
{
  vec3 ba = b - a; vec3 pa = p - a;
  vec3 cb = c - b; vec3 pb = p - b;
  vec3 ac = a - c; vec3 pc = p - c;
  vec3 nor = cross( ba, ac );

  return sqrt(
    (sign(dot(cross(ba,nor),pa)) +
     sign(dot(cross(cb,nor),pb)) +
     sign(dot(cross(ac,nor),pc))<2.0)
     ?
     min( min(
     dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
     dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),
     dot2(ac*clamp(dot(ac,pc)/dot2(ac),0.0,1.0)-pc) )
     :
     dot(nor,pa)*dot(nor,pa)/dot2(nor) );
     */
}
}

/*
 * Quad - exact   (https://www.shadertoy.com/view/Md2BWW)
 */
class Quad extends SDFShape {
    static random() {
        const position = new vec3(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() - 0.5) * canvas.clientWidth / 10);
            
        const angle = 360 * Math.random();
        const radius = 0.4 * canvas.clientWidth * Math.random();
        
        return new Quad(position, angle, radius);
    }
    constructor(position, angle, radius) {
        super(position);
        this.sin = Math.sin(angle * Math.PI / 180);
        this.cos = Math.cos(angle * Math.PI / 180);
        this.radius = radius;
    }
    dist(point) {
        const p = this.local(point);
/*

float udQuad( vec3 p, vec3 a, vec3 b, vec3 c, vec3 d )
{
  vec3 ba = b - a; vec3 pa = p - a;
  vec3 cb = c - b; vec3 pb = p - b;
  vec3 dc = d - c; vec3 pc = p - c;
  vec3 ad = a - d; vec3 pd = p - d;
  vec3 nor = cross( ba, ad );

  return sqrt(
    (sign(dot(cross(ba,nor),pa)) +
     sign(dot(cross(cb,nor),pb)) +
     sign(dot(cross(dc,nor),pc)) +
     sign(dot(cross(ad,nor),pd))<3.0)
     ?
     min( min( min(
     dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
     dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),
     dot2(dc*clamp(dot(dc,pc)/dot2(dc),0.0,1.0)-pc) ),
     dot2(ad*clamp(dot(ad,pd)/dot2(ad),0.0,1.0)-pd) )
     :
     dot(nor,pa)*dot(nor,pa)/dot2(nor) );
 */
}
}


/*
float opRevolution( in vec3 p, in sdf2d primitive, float o )
{
    vec2 q = vec2( length(p.xz) - o, p.y );
    return primitive(q)
}


float opExtrusion( in vec3 p, in sdf2d primitive, in float h )
{
    float d = primitive(p.xy)
    vec2 w = vec2( d, abs(p.z) - h );
    return min(max(w.x,w.y),0.0) + length(max(w,0.0));
}



float opElongate( in sdf3d primitive, in vec3 p, in vec3 h )
{
    vec3 q = p - clamp( p, -h, h );
    return primitive( q );
}

float opElongate( in sdf3d primitive, in vec3 p, in vec3 h )
{
    vec3 q = abs(p)-h;
    return primitive( max(q,0.0) ) + min(max(q.x,max(q.y,q.z)),0.0);
}





float opOnion( in float sdf, in float thickness )
{
    return abs(sdf)-thickness;
}

float opRepetition( in vec3 p, in vec3 s, in sdf3d primitive )
{
    vec3 q = p - s*round(p/s);
    return primitive( q );
}


vec3 opLimitedRepetition( in vec3 p, in float s, in vec3 l, in sdf3d primitive )
{
    vec3 q = p - s*clamp(round(p/s),-l,l);
    return primitive( q );
}


float opDisplace( in sdf3d primitive, in vec3 p )
{
    float d1 = primitive(p);
    float d2 = displacement(p);
    return d1+d2;
}

Twist


float opTwist( in sdf3d primitive, in vec3 p )
{
    const float k = 10.0; // or some other amount
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return primitive(q);
}

Bend


float opCheapBend( in sdf3d primitive, in vec3 p )
{
    const float k = 10.0; // or some other amount
    float c = cos(k*p.x);
    float s = sin(k*p.x);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xy,p.z);
    return primitive(q);
}



*/




class Mix extends SDFShape {
    static random() {
        const shapes = [Ball, BoxFrame, Box, Mix];
        const shape1 = randomChoice(shapes).random();
        const shape2 = randomChoice(shapes).random();
        const factor = 20 + 20 * Math.random();
        const operation = randomChoice([Mix.subtraction, Mix.intersection, Mix.xor, Mix.mix]);
        return new Mix(shape1, shape2, factor, operation);
    }

    static union(dist1, dist2) {
        return Math.min(dist1, dist2);
    }
    static subtraction(dist1, dist2) {
        return Math.max(-dist1, dist2);
    }
    static intersection(dist1, dist2) {
        return Math.max(dist1, dist2);
    }
    static xor(dist1, dist2) {
        return Math.max(Math.min(dist1, dist2), -Math.max(dist1, dist2));
    }
    static mix(dist1, dist2) {
        const r = Math.exp(-dist1 / this.factor) + Math.exp(-dist2 / this.factor);
        return -this.factor * Math.log(r);
    }

    static opSmoothUnion(dist1, dist2) {
        const h = clamp(0.5 + 0.5 * (dist2 - dist1) / this.factor, 0.0, 1.0);
        return Mix.mix(dist2, dist1, h) - this.factor * h * (1.0 - h);
    }

    static opSmoothSubtraction(dist1, dist2) {
        const h = clamp(0.5 - 0.5 * (dist2 + dist1) / this.factor, 0.0, 1.0);
        return Mix.mix(dist2, -dist1, h) + this.factor * h * (1.0 - h);
    }

    static opSmoothIntersection(dist1, dist2) {
        const h = clamp(0.5 - 0.5 * (dist2 - dist1) / this.factor, 0.0, 1.0);
        return Mix.mix(dist2, dist1, h) + this.factor * h * (1.0 - h);
    }

    constructor(shape1, shape2, factor, operation) {
        super();
        this.shape1 = shape1;
        this.shape2 = shape2;
        this.factor = factor;
        this.baseFactor = factor;
        this.position = new vec3();
        this.operation = operation;
    }
    getHue(point) {
        const dist1 = this.shape1.dist(point.clone());
        const dist2 = this.shape2.dist(point.clone());
        const r = Math.exp(-dist1 / this.factor) + Math.exp(-dist2 / this.factor);
        const mix = -this.factor * Math.log(r);


    }
    dist(point) {
        const dist1 = this.shape1.dist(point.clone());
        const dist2 = this.shape2.dist(point.clone());

        return this.operation(dist1, dist2);
    }
    update(time) {
        this.factor = this.baseFactor;
        this.shape1.update(time);
        this.shape2.update(time);
    }

}

function initialise() {
    app.canvas = document.getElementById('canvas');
    app.ctx = canvas.getContext('2d');
    app.canvas.width = canvas.clientWidth;
    app.canvas.height = canvas.clientHeight;

    message(`${canvas.clientWidth} x ${canvas.clientHeight}`);
    /*
    const shapes = [Ball, BoxFrame, Mix];
    app.shapes.push(Mix.random());
    for (let i = 0; i < 10 ; ++i) {
        app.shapes.push(randomChoice(shapes).random());
    }
*/
    app.canvas.addEventListener('click', click);
    app.canvas.addEventListener('mousemove', mouseMove);
    app.canvas.addEventListener('touchmove', touchMove);
    app.canvas.addEventListener('touchend', touchEnd);
    render();
    //window.requestAnimationFrame(draw);
}


// exponential
function smin(values, k) {
    const r = values.reduce((sum, value) => sum += Math.exp(-value / k), 0);
    return -k * Math.log(r);
}


function normal(point, shape) {
    const epsilon = 0.001; // arbitrary — should be smaller than any surface detail in your distance function, but not so small as to get lost in float precision
    //const distFn = (point) => Math.min(...app.shapes.map((shape) => shape.dist(point.clone())));
    const centerDistance = shape.dist(point.clone());
    const xDistance = shape.dist(new vec3(point.x + epsilon, point.y, point.z));
    const yDistance = shape.dist(new vec3(point.x, point.y + epsilon, point.z));
    const zDistance = shape.dist(new vec3(point.x, point.y, point.z + epsilon));
    return new vec3(
        (xDistance - centerDistance) / epsilon,
        (yDistance - centerDistance) / epsilon,
        (zDistance - centerDistance) / epsilon);
}


function similar(p0, p1, p2, p3) {
    const ratio = p0.clone().subtract(p3).length / p0.clone().subtract(p1).length;
    const offset = p2.clone().subtract(p1).scale(ratio);
    return p3.clone().add(offset);
}


function ray(point, sx, sy, size, eye, limit = 1) {

    //point = point.clone();

    const direction = (new vec3(sx, sy, 0)).subtract(eye).normalise();
    //const direction = (new vec3(sx + size / 2, sy + size / 2, 0 )).subtract(eye).normalise();

    let exit = false;
    let cycles = 0;
    while (!exit) {
        const step = Math.min(...app.shapes.map((shape) => shape.dist(point.clone())));

        if (step < 0) {
            point.add(direction.clone().scale(step));
        } else if (Math.abs(step) < size * 2) {
            if (size > limit) {
                const size2 = size / 2;
                ray(point.clone(), sx, sy, size2, eye, limit);
                const back = direction.clone().scale(step * -1);
                const p1 = similar(eye, new vec3(sx, sy, 0), new vec3(sx + size2, sy, 0), point.clone().add(back));
                const p2 = similar(eye, new vec3(sx, sy, 0), new vec3(sx, sy + size2, 0), point.clone().add(back));
                const p3 = similar(eye, new vec3(sx, sy, 0), new vec3(sx + size2, sy + size2, 0), point.clone().add(back));
                ray(p1, sx + size2, sy, size2, eye, limit);
                ray(p2, sx, sy + size2, size2, eye, limit);
                ray(p3, sx + size2, sy + size2, size2, eye, limit);
                exit = true
            } else {
                const shape = app.shapes.find((shape) => shape.dist(point.clone()) == step);
                app.ctx.fillStyle = shape.getColour(point);
                app.ctx.fillRect(sx, sy, size, size);
            }
        }
        point.add(direction.clone().scale(step));

        if (point.z > 1000) { //box.width) {
            app.ctx.fillStyle = `rgb(10, 10, 80)`;
            app.ctx.fillRect(sx, sy, size, size);

            exit = true;
        }

        if (Math.abs(step) < size) {
            exit = true;
        }
        ++cycles;
        if (cycles > 1000) {
            message('Cycles limit exceeded!');
            console.log(`Cycles limit exceeded! ${point.x}, ${point.y}, ${point.z}`);
        }
    }
}

function ray2(point, sx, sy, size, eye, limit = 1) {

    //point = point.clone();

    const direction = (new vec3(sx, sy, 0)).subtract(eye).normalise();
    //const direction = (new vec3(sx + size / 2, sy + size / 2, 0 )).subtract(eye).normalise();

    let exit = false;
    let cycles = 0;
    while (!exit) {
        const step = Math.min(...app.shapes.map((shape) => shape.dist(point.clone())));

        if (step < 0) {
            point.add(direction.clone().scale(step));
        } else if (Math.abs(step) < size * 2) {
            if (size > limit) {
                const size2 = size / 2;
                ray(point.clone(), sx, sy, size2, eye, limit);
                ray(eye.clone(), sx + size2, sy, size2, eye, limit);
                ray(eye.clone(), sx, sy + size2, size2, eye, limit);
                ray(eye.clone(), sx + size2, sy + size2, size2, eye, limit);
                /*
                const back = direction.clone().scale(step * -1);
                const p1 = similar(eye, new vec3(sx, sy, 0), new vec3(sx + size2, sy, 0), point.clone().add(back));
                const p2 = similar(eye, new vec3(sx, sy, 0), new vec3(sx, sy + size2, 0), point.clone().add(back));
                const p3 = similar(eye, new vec3(sx, sy, 0), new vec3(sx + size2, sy + size2, 0), point.clone().add(back));
                ray(p1, sx + size2, sy, size2, eye, limit);
                ray(p2, sx, sy + size2, size2, eye, limit);
                ray(p3, sx + size2, sy + size2, size2, eye, limit);
                */
                exit = true
            } else {
                const shape = app.shapes.find((shape) => shape.dist(point.clone()) == step);
                app.ctx.fillStyle = shape.getColour(point);
                app.ctx.fillRect(sx, sy, size, size);
            }
        }
        point.add(direction.clone().scale(step));

        if (point.z > 1000) { //box.width) {
            app.ctx.fillStyle = `rgb(10, 10, 80)`;
            app.ctx.fillRect(sx, sy, size, size);

            exit = true;
        }

        if (Math.abs(step) < size) {
            exit = true;
        }
        ++cycles;
        if (cycles > 1000) {
            message('Cycles limit exceeded!');
            console.log(`Cycles limit exceeded! ${point.x}, ${point.y}, ${point.z}`);
        }
    }
}

function march() {
    const pixels = 64;
    const box = app.canvas.getBoundingClientRect();

    app.ctx.fillStyle = 'lightgray';

    const eye = new vec3(box.width / 2, box.height / 2, -box.width);

    ray(eye.clone(), sx, sy, pixels, eye, limit);

    for (sy = 0; sy < box.height; sy += pixels) {
        for (sx = 0; sx < box.width; sx += pixels) {
            ray(eye.clone(), sx, sy, pixels, eye, limit);
        }
    }
}

function march2() {
    const box = app.canvas.getBoundingClientRect();
    app.ctx.beginPath();
    for (let i = 0; i < 360; i += 1) {
        const angle = Math.PI * i / 180;
        const dx = Math.sin(angle);
        const dy = Math.cos(angle);
        let exit = false;

        const point = { x: app.point.x, y: app.point.y }
        app.ctx.moveTo(point.x, point.y);
        while (!exit) {
            //const step = Math.abs(Math.min(...app.shapes.map((shape) => shape(point)))) || 0;
            const step = Math.abs(smin(app.shapes.map((shape) => shape(point)), 15)) || 0;
            message(step);

            point.x += dx * step;
            point.y += dy * step;
            app.ctx.lineTo(point.x, point.y);

            if ((point.x < 0) || (point.x > box.width) || (point.y < 0) || (point.y > box.height) || (step < 1)) {
                exit = true;
            }
        }
    }
    app.ctx.stroke();
}

function march3() {
    const box = app.canvas.getBoundingClientRect();
    app.ctx.beginPath();
    for (let i = 0; i < 360; i += 1) {
        const angle = Math.PI * i / 180;
        const dx = Math.sin(angle);
        const dy = Math.cos(angle);
        let exit = false;

        const point = { x: app.point.x, y: app.point.y }
        //app.ctx.moveTo(point.x, point.y);
        while (!exit) {
            const step = Math.abs(smin(app.shapes.map((shape) => shape(point)), 15)) || 0;
            message(step);

            point.x += dx * step;
            point.y += dy * step;
            if (step < 1) {
                app.ctx.lineTo(point.x, point.y);
            }
            if ((point.x < 0) || (point.x > box.width) || (point.y < 0) || (point.y > box.height) || (step < 1)) {
                exit = true;
            }
        }
    }
    app.ctx.stroke();
}

function march1() {
    const box = app.canvas.getBoundingClientRect();
    for (let i = 0; i < 360; i += 5) {
        const angle = Math.PI * i / 180;
        const dx = Math.sin(angle);
        const dy = Math.cos(angle);
        let exit = false;

        const point = { x: app.point.x, y: app.point.y }
        app.ctx.beginPath();
        //app.ctx.moveTo(point.x, point.y);
        while (!exit) {
            ///const step = Math.abs(Math.min(...app.shapes.map((shape) => shape(point)))) || 0;
            const step = Math.abs(smin(app.shapes.map((shape) => shape(point)), 0.5)) || 0;
            message(step);

            point.x += dx * step;
            point.y += dy * step;
            app.ctx.arc(point.x, point.y, step, 0, Math.PI * 2, false);
            //app.ctx.lineTo(point.x, point.y);
            if ((point.x < 0) || (point.x > box.width) || (point.y < 0) || (point.y > box.height) || (step < 1)) {
                exit = true;
            }
        }
        app.ctx.stroke();
    }
}

let limit = 32;

function render() {
    const box = app.canvas.getBoundingClientRect();
    limit = 16;
    //const shapes = [Ball, BoxFrame, Mix];
    const shapes = [RoundCone];//[Mix];
    app.shapes.length = 0;
    for (let i = 0; i < 10; ++i) {
        app.shapes.push(randomChoice(shapes).random());
    }

    app.light = (new vec3(-0.1, -0.3, -1.0)).normalise();
    app.eye = new vec3(box.width / 2, box.height / 2, -box.width);
    app.sx = 0;
    app.sy = 0;

    app.ctx.setTransform(1, 0, 0, 1, 0, 0);
    app.ctx.clearRect(0, 0, app.ctx.canvas.width, app.ctx.canvas.height);
    app.ctx.restore();

    window.requestAnimationFrame(draw);
}

function draw(frameTime) {
    // Store the current transformation matrix
    app.ctx.save();

    app.shapes.forEach((shape) => shape.update(frameTime));

    // Use the identity matrix while clearing the canvas
    /*
    app.ctx.setTransform(1, 0, 0, 1, 0, 0);
    app.ctx.clearRect(0, 0, app.ctx.canvas.width, app.ctx.canvas.height);
    app.ctx.restore();
    march();
    */

    const pixels = 64;
    const box = app.canvas.getBoundingClientRect();

    //const eye = new vec3(box.width / 2, box.height / 2, -box.width);

    ray(app.eye.clone(), app.sx, app.sy, pixels, app.eye, limit);
    let done = false;
    app.sx += pixels;
    if (app.sx >= box.width) {
        app.sx = 0;
        app.sy += pixels;
        if (app.sy >= box.height) {
            app.sy = 0;
            if (limit > 1) {
                limit *= 0.5;
                message(limit);
            } else {
                message('Done');
                done = true;
            }
        }
    }

    app.lastTime = frameTime;
    if (!done) {
        window.requestAnimationFrame(draw);
    }
    /*
    if (limit > 1) {
        limit *= 0.5;
        message(limit);
        window.requestAnimationFrame(draw);
    }
    */
}
