
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
    
    app.shapes[0].position.x = event.clientX - box.x;
    app.shapes[0].position.y = event.clientY - box.y;
    
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

class vec3 {
    constructor(x=0, y=0, z=0) {
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
    minus(v) {
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

function minus(v1, v2) {
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
    constructor() {
        this.hue = 360 * Math.random();
        this.saturation = 100 * Math.random();
        this.lightness = 100 * Math.random();
    }
    getColour(point) {
        const lightness = this.lightness * normal(point, this).dot(app.light);
        return `hsl(${this.hue} ${this.saturation}% ${lightness}%)`;
    }
    update(time) {
        
    }

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
        return point.clone().minus(this.position).length - this.radius;
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
        return point.clone().minus(this.position).length - this.radius;
    }
    update(time) {
        this.radius = this.baseRadius * (1.5 + Math.sin(this.offset * time / 1000));
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
        super();
        this.position = position;
        this.size = size;
        this.e = e;
        this.radius = radius;
    }
    dist(point) {
        const p = point.minus(this.position).abs().minus(this.size);
        const q = p.clone().inc(this.e).iabs().dec(this.e);
    
        return Math.min(
          length(inc(max({x: p.x, y: q.y, z: q.z}, 0), Math.min(Math.max(p.x, q.y, q.z), 0))),
          length(inc(max({x: q.x, y: p.y, z: q.z}, 0), Math.min(Math.max(q.x, p.y, q.z), 0))),
          length(inc(max({x: q.x, y: q.y, z: p.z}, 0), Math.min(Math.max(q.x, q.y, p.z), 0)))) - this.radius;
    }
    update(time) {
        
    }
}

class Mix extends SDFShape {
    static random() {
        const shapes = [Ball, BoxFrame, Mix];
        const shape1 = randomChoice(shapes).random();
        const shape2 = randomChoice(shapes).random();
        const factor = 20 + 20 * Math.random();
        const operation = randomChoice([Mix.subtraction, Mix.intersection, Mix.xor, Mix.mix]);
        return new Mix(shape1, shape2, factor, operation);
    }
    
    static union( dist1, dist2 ) {
        return Math.min(dist1, dist2);
    }
    static subtraction( dist1, dist2 ) {
        return Math.max(-dist1, dist2);
    }
    static intersection( dist1, dist2 ) {
        return Math.max(dist1, dist2);
    }
    static xor(dist1, dist2) {
        return Math.max(Math.min(dist1, dist2),-Math.max(dist1, dist2));
    }
    static mix(dist1, dist2) {
        const r = Math.exp(-dist1 / this.factor) + Math.exp(-dist2 / this.factor);
        return -this.factor * Math.log(r);   
    }
    
    static opSmoothUnion( dist1, dist2 ) {
        const h = clamp( 0.5 + 0.5*(dist2-dist1)/this.factor, 0.0, 1.0 );
        return Mix.mix( dist2, dist1, h ) - this.factor*h*(1.0-h);
    }
    
    static opSmoothSubtraction( dist1, dist2 ) {
        const h = clamp( 0.5 - 0.5*(dist2+dist1)/this.factor, 0.0, 1.0 );
        return Mix.mix( dist2, -dist1, h ) + this.factor*h*(1.0-h);
    }
    
    static opSmoothIntersection( dist1, dist2 ) {
        const h = clamp( 0.5 - 0.5*(dist2-dist1)/this.factor, 0.0, 1.0 );
        return Mix.mix( dist2, dist1, h ) + this.factor*h*(1.0-h);
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
    app.canvas.addEventListener('mousemove', (event) => mouseMove(event));
    app.canvas.addEventListener('touchmove', (event) => touchMove(event));
    app.canvas.addEventListener('touchend', (event) => touchEnd(event));
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
    const xDistance = shape.dist(new vec3(point.x + epsilon, point.y, point.z ));
    const yDistance = shape.dist(new vec3(point.x, point.y + epsilon, point.z ));
    const zDistance = shape.dist(new vec3(point.x, point.y, point.z + epsilon ));
    return new vec3(
        (xDistance - centerDistance) / epsilon,
        (yDistance - centerDistance) / epsilon,
        (zDistance - centerDistance) / epsilon);
}


function similar(p0, p1, p2, p3) {
    const ratio = p0.clone().minus(p3).length / p0.clone().minus(p1).length;
    const offset = p2.clone().minus(p1).scale(ratio);
    return p3.clone().add(offset);
}


function ray(point, sx, sy, size, eye, limit=1) {

    //point = point.clone();

    const direction = (new vec3(sx, sy, 0 )).minus(eye).normalise();
    //const direction = (new vec3(sx + size / 2, sy + size / 2, 0 )).minus(eye).normalise();

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

function ray2(point, sx, sy, size, eye, limit=1) {

    //point = point.clone();

    const direction = (new vec3(sx, sy, 0 )).minus(eye).normalise();
    //const direction = (new vec3(sx + size / 2, sy + size / 2, 0 )).minus(eye).normalise();

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

        const point = {x: app.point.x, y: app.point.y}
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

        const point = {x: app.point.x, y: app.point.y}
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

        const point = {x: app.point.x, y: app.point.y}
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
    const shapes = [Mix];
    app.shapes.length = 0;
    app.shapes.push(Mix.random());
    for (let i = 0; i < 10 ; ++i) {
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
