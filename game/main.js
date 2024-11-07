function saw(value, max) {
    return value - max * Math.floor(value / max);
}


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
        let ty = -saw(this.y, this.tileHeight);

        let tileY = saw(Math.floor(this.y / this.tileHeight), this.pattern.length);

        const tileColumns = Math.floor(this.tiles.width / this.tileWidth);

        while (ty < target.height) {
            const row = this.pattern[tileY % this.pattern.length];
            let tileX = saw(Math.floor(this.x / this.tileWidth), row.length);
            let tx = -saw(this.x, this.tileWidth);

            const height = ty > 0 ? this.tileHeight : this.tileHeight + ty;
            const oy = this.tileHeight - height;
            while (tx < target.width) {
                const tile = row[tileX % row.length];
                const width = tx > 0 ? this.tileWidth : this.tileWidth + tx;
                const ox = this.tileWidth - width;
                const sx = this.tileWidth * (tile % tileColumns) + ox;
                const sy = this.tileHeight * Math.floor(tile / tileColumns) + oy;
                target.drawImage(this.tiles.canvas, sx, sy, width, height, tx + ox, ty + oy, width, height);
                tx += this.tileWidth;
                tileX += 1;
            }

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
    window.requestAnimationFrame(render);
    /*
    context.fillStyle = 'white';

    context.fillRect(0, 0, context.width, context.height);
    */

    layer.draw(context);

    if (last) {
        const delta = (time - last) / 1000;
        layer.x = 2000 * Math.sin(time / 22000);
        layer.y = 2000 * Math.cos(time / 10000);
        document.getElementById('fps').innerHTML = `${(1 / delta).toFixed(1)}`;
    }
    last = time;


}



function main(event) {
    const playArea = document.getElementById('play-area');
    playArea.style.width = '640px';
    playArea.style.height = '640px';
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
        imageCanvas.width = image.width;
        imageCanvas.height = image.height;
        imageContext.width = image.width;
        imageContext.height = image.height;
        // draw background image
        imageContext.drawImage(image, 0, 0);
        const cols = Math.floor(image.width / 32);
        const rows = Math.floor(image.height / 32);
        const pattern = [];
        for (let row = 0; row < rows; row += 1) {
            const row_pattern = [];
            pattern.push(row_pattern);
            for (let col = 0; col < cols; col += 1) {
                row_pattern.push(col + row * cols);
            }
        }
        layer = new TiledLayer(imageContext, pattern);

        window.requestAnimationFrame(render);
    };

    image.src = 'puppy.jpeg';
}

addEventListener('load', main);
