class TiledLayer {
    constructor(tiles, pattern, tileWidth=32, tileHeight=32) {
        this.tiles = tiles;
        this.pattern = pattern;
        this.tileWidth = tileWidth || 32;
        this.tileHeight = tileHeight || this.tileWidth;

        this.x = 0;
        this.y = 0;
    }

    draw(target) {
        // Calculate position of top left tile
        let ty = this.y % this.tileHeight - this.tileHeight;

        let tileX = Math.floor(Math.abs(this.x) / this.tileWidth);
        let tileY = Math.floor(Math.abs(this.y) / this.tileHeight);

        while (ty < target.height) {
            let tx = this.x % this.tileWidth - this.tileWidth;
            const row = this.pattern[tileY % this.pattern.length];
            while (tx < target.width) {
                const tile = row[tileX % row.length];
                const tileColumns = Math.floor(this.tiles.width / this.tileWidth);
                const sx = this.tileWidth * (tile % tileColumns);
                const sy = this.tileHeight * Math.floor(tile / tileColumns);
                target.drawImage(this.tiles.canvas, sx, sy, this.tileWidth, this.tileHeight, tx, ty, this.tileWidth, this.tileHeight);
                tx += this.tileWidth;
                tileX += 1;
            }
            tileX = Math.floor(this.x / this.tileWidth);
            tileY += 1;
            ty += this.tileHeight;
        }
    }
}

document.body.style.background = 'blue';

let context;
let layer;
let last = 0;

function render(time) {
    context.fillStyle = 'white';

    context.fillRect(0, 0, context.width, context.height);
    layer.draw(context);

    if (last) {
        const delta = (time - last) / 1000;
        layer.x += 20 * Math.sin(time / 100000);
        layer.y += 20 * Math.cos(time / 100000);
    }
    last = time;

    //window.requestAnimationFrame(render);
}



function main(event) {
    const playArea = document.getElementById('play-area');
    context = playArea.getContext('2d');
    context.width = 640;
    context.height = 800;

    playArea.style.aspectRatio = context.width / context.height;

    // Loading of the home test image - img1
    const image = new Image();

    // drawing of the test image - img1
    image.onload = function () {
        const imageCanvas = document.createElement('canvas');
        document.body.append(imageCanvas);
        const imageContext = imageCanvas.getContext('2d');
        imageContext.width = image.width;
        imageContext.height = image.height;
        // draw background image
        imageContext.drawImage(image, 0, 0);
        layer = new TiledLayer(imageContext, [[0, 1], [2, 3]]);

        window.requestAnimationFrame(render);
    };

    image.src = 'puppy.jpeg';
}

addEventListener('load', main);