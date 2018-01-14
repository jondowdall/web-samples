
/**
 *
 */
var myData = {
    balls: [{
        x: 100,
        y: 100,
        vx: 100,
        vy: 100,
        r: 5
    },
    {
        x: 130,
        y: 90,
        vx: 100,
        vy: 100,
        r: 10
    }]
}

function initialise() {
    myData.canvas = document.getElementById('canvas')
    myData.ctx = canvas.getContext('2d')
    myData.canvas.width = canvas.clientWidth
    myData.canvas.height = canvas.clientHeight
    window.requestAnimationFrame(draw)
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    myData.audio = new AudioContext();
    loadAudio('boing.wav')
}

function loadAudio(path) {
    var request = new XMLHttpRequest()
    request.open('GET', path, true)
    request.responseType = 'arraybuffer'

    request.onload = function() {
        myData.audio.decodeAudioData(request.response, function (buffer) {
            myData[path] = buffer
        })
    }
    request.send()
}

function playSound(sound) {
    var source = myData.audio.createBufferSource()
    source.buffer = myData[sound]
    source.connect(myData.audio.destination)
    source.start(0)
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

    myData.balls.forEach(function(ball, index, all) {
        myData.ctx.beginPath()
        myData.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false)
        myData.ctx.stroke()
    })

    if (myData.lastTime !== undefined) {
        delta = (frameTime - myData.lastTime) / 1000
        myData.balls.forEach(function(ball, index, all) {
            ball.x += ball.vx * delta
            ball.y += ball.vy * delta
            if (ball.x < ball.r || ball.x > myData.ctx.canvas.width - ball.r) {
                ball.vx = -ball.vx
                ball.x += ball.vx * delta
                playSound('boing.wav')
            } 
            if (ball.y < ball.r || ball.y > myData.ctx.canvas.height - ball.r) {
                ball.vy = -ball.vy
                ball.y += ball.vy * delta
                playSound('boing.wav')
            } 
        })
    }
    myData.lastTime = frameTime 
}
