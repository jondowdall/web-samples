class Layer {
    constuctor(tiles, pattern, tileWidth=32, tileHeight=32) {
        self.tiles = tiles;
        self.pattern = pattern;
        self.tileWidth = tileWidth || 32;
        self.tileHeight = tileHeight || self.tileWidth;

        self.x = 0;
        self.y = 0;
    }

    draw(target) {
        // Calculate position of top left tile
        let tx = self.x % self.tileWidth - self.tileWidth;
        let ty = self.y % self.tileHeight - self.tileHeight;

        let tileX = Math.floor(self.x / self.tileWidth);
        let tileY = Math.floor(self.y / self.tileHeight);
            console.log(ty);
        while (ty < target.height) {
            const row = self.pattern[tileY % self.pattern.length];
            while (tx < target.width) {
                const tile = row[tileX % row.length];
                const tileColumns = Math.floor(self.tile.width / tile.width);
                const sx = tile.width * (tile % tileColumns);
                const sy = tile.height * Math.floor(tile / tileColumns);
                target.canvas.drawImage(self.tiles, sx, sy, self.tileWidth, self.tileHeight, tx, ty);
                tx += this.tileWidth;
                tileX += 1;
            }
            tileX = Math.floor(self.x / self.tileWidth);
            tileY += 1;
            ty += this.tileHeight;
        }
    }
}

document.body.style.background = 'blue';

let context;
let layer;

function render(time) {
    context.fillStyle = 'white';

    context.fillRect(0, 0, context.width, context.height);
    layer.draw(context);

    window.requestAnimationFrame(render);
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
        // draw background image
        imageContext.drawImage(image, 0, 0);
        layer = new Layer(imageContext, [[0]]);

        window.requestAnimationFrame(render);
    };

    image.src = 'puppy.jpeg';
}

addEventListener('load', main);