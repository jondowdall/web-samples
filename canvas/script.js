
/**
 *
 */
function initialise() {
    var ids = ['plain', 'css-sized', 'attr-sized', 'css-and-attr-sized', 'mismatched']
    ids.forEach(function(id, index, all) {
        var canvas = document.getElementById(id)
        var context = canvas.getContext('2d')
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
        draw(context)
    })
}

function draw(ctx) {
    // Store the current transformation matrix
    ctx.save()
    
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()

    ctx.arc(100, 100, 75, 0, Math.PI * 2, false)
    ctx.strokeRect(25, 25, 150, 150)
    ctx.fillText("The quick brown fox jumped over the lazy dog's back", 50, 100)

    ctx.beginPath()
    ctx.moveTo(25, 25)
    ctx.lineTo(175, 175)
    ctx.moveTo(175, 25)
    ctx.lineTo(25, 175)
    ctx.stroke()
}
