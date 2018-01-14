
/**
 *
 */
var myData = {
    x: 100,
    y: 100,
    vx: 100,
    vy: 100,
    r: 5,
}

function initialise() {
    myData.canvas = document.getElementById('canvas')
    myData.ctx = canvas.getContext('2d')
    myData.canvas.width = canvas.clientWidth
    myData.canvas.height = canvas.clientHeight
    window.requestAnimationFrame(draw)
}



function draw(frameTime) {
    var delta
    window.requestAnimationFrame(draw)
    // Store the current transformation matrix
    myData.ctx.save()
    
    // Use the identity matrix while clearing the canvas
    myData.ctx.setTransform(1, 0, 0, 1, 0, 0)
    myData.ctx.clearRect(0, 0, myData.ctx.canvas.width, myData.ctx.canvas.height)
    myData.ctx.restore()

    myData.ctx.beginPath()
    myData.ctx.arc(myData.x, myData.y, myData.r, 0, Math.PI * 2, false)
    myData.ctx.stroke()

    if (myData.lastTime !== undefined) {
        delta = (frameTime - myData.lastTime) / 1000
        myData.x += myData.vx * delta
        myData.y += myData.vy * delta
        if (myData.x < myData.r || myData.x > myData.ctx.canvas.width - myData.r) {
            myData.vx = -myData.vx
            myData.x += myData.vx * delta
        } 
        if (myData.y < myData.r || myData.y > myData.ctx.canvas.height - myData.r) {
            myData.vy = -myData.vy
            myData.y += myData.vy * delta
        } 
    }
    myData.lastTime = frameTime 
}
