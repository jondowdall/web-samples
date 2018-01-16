var log = (function() {
    var my = {} 
    my.append = function(text) {
        var node = document.getElementById('log')
        node.innerHTML += '<br>' + text
    }
    return my
})()

var kernel = [
    1, 1, 1,
    1, 2, 1,
    1, 1, 1
]
var weight

function initialiseControls() {

    var autoCalculateWeight = false
    var weightInput = document.getElementById('weight')
    weight = weightInput.value = calculateWeight(kernel)
    weightInput.addEventListener('blur', function(event) {
        if (weightInput.value === '') {
            weightInput.className = 'auto-value'
            weightInput.value = calculateWeight(kernel)
            autoCalculateWeight = true
        } else {
            weightInput.className = ''
            autoCalculateWeight = false
        }
        weight = weightInput.value
    })
 
   
    function calculateWeight(kernel) {
        var weight = kernel.reduce(function(prev, curr) {
            return prev + curr
        })
        return weight <= 0 ? 1 : weight
    }
   
    var values = ['k00', 'k01', 'k02', 'k10', 'k11', 'k12', 'k20', 'k21', 'k22']
    values.forEach(function(id, index, all) {
        var node = document.getElementById(id)
        node.value = kernel[index]
        node.addEventListener('blur', function(event) {
            kernel[index] = parseInt(node.value)
            if (autoCalculateWeight) {
                weightInput.value = calculateWeight(kernel)
            }
        })
    })
   
    document.getElementById('controls-title').addEventListener('click', function(event) {
        var node = document.getElementById('controls-box')
        if (node.style.display === 'none') {
            node.style.display = 'block'
        } else {
            node.style.display = 'none'
        }
    })
}

/**
*
*/
var facing = true
function initialise() {
    var canvas = document.getElementById('main-canvas')   
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    var restart = document.getElementById('restart')
    var fullscreen = document.getElementById('fullscreen')
    var stop = document.getElementById('stop')
    var changeCamera = document.getElementById('flip')
    var changeBackgroundButton = document.getElementById('change-background')
    
    var backgroundMovie = true 

    if (!gl) {
        alert('Unable to get WebGL context')
        return
    }
   
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
 
    const vsSource =
       `attribute vec4 aVertexPosition;    
        attribute vec2 aTextureCoord;
       
        uniform mat4 uTransform;
       
        varying highp vec2 vTextureCoord;
       
        void main() {
            gl_Position = uTransform * aVertexPosition;
            vTextureCoord = aTextureCoord;
        }`
       
    const fsSource =
       `
        varying highp vec2 vTextureCoord;

        uniform sampler2D initialFrame;
        uniform sampler2D currentFrame;
        uniform sampler2D background;

        uniform highp vec2 u_textureSize;
        uniform highp float u_kernel[9];
        uniform highp float u_kernelWeight;
        uniform highp float u_threshold;

        highp vec4 smoothed(sampler2D source) {
            highp vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
            highp vec4 colorSum =
              texture2D(source, vTextureCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
              texture2D(source, vTextureCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
              texture2D(source, vTextureCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
              texture2D(source, vTextureCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
              texture2D(source, vTextureCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
              texture2D(source, vTextureCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
              texture2D(source, vTextureCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
              texture2D(source, vTextureCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
              texture2D(source, vTextureCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
            return colorSum / u_kernelWeight;
        }

        void main() {
            highp vec4 initial = smoothed(initialFrame);
            highp vec4 current = smoothed(currentFrame);
            highp vec4 background = texture2D(background, vTextureCoord);
            highp vec4 deltav = abs(initial - current);
            highp float delta = floor((1.0 - u_threshold) + (deltav.r + deltav.g + deltav.b) / 3.0);

            highp vec4 texelColor = mix(background, texture2D(currentFrame, vTextureCoord), delta);
            gl_FragColor = vec4(texelColor.rgb, 1.0);
        }`
       
    const shaderProgram = initialiseShaders(gl, vsSource, fsSource)
   
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocation: {
            transform: gl.getUniformLocation(shaderProgram, 'uTransform'),
            initialFrame: gl.getUniformLocation(shaderProgram, 'initialFrame'),
            currentFrame: gl.getUniformLocation(shaderProgram, 'currentFrame'),
            background: gl.getUniformLocation(shaderProgram, 'background'),
            kernel: gl.getUniformLocation(shaderProgram, 'u_kernel[0]'),
            kernelWeight: gl.getUniformLocation(shaderProgram, 'u_kernelWeight'),
            threshold: gl.getUniformLocation(shaderProgram, 'u_threshold'),
            textureSize: gl.getUniformLocation(shaderProgram, 'u_textureSize')
        }
    }

    const buffers = initBuffers(gl)
    // Load texture
    const backgroundImage = loadTexture(gl, 'cubetexture.png')
    const backgroundMovieTex = initTexture(gl)
    const initialFrame = initTexture(gl)
    const currentFrame = initTexture(gl)

    const textures = {
        initialFrame: initialFrame,
        currentFrame: currentFrame,
        background: backgroundMovieTex
    }
  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      //log.append(device.kind + ": " + device.label + " id = " + device.deviceId);
    });
  })
  .catch(function(err) {
    log.append(err.name + ": " + err.message);
  });

  var videoStream;
  function changeBackground() {
      backgroundMovie = ! backgroundMovie
      if (backgroundMovie) {
          textures.background = backgroundMovieTex
          videoStream = setupVideo('Firefox.mp4')
          copyVideo = false
      } else {
        textures.background = backgroundImage
        if (videoStream) {
            videoStream.stop()
        }
      }
  }

  changeBackground()

  const cameraStream = document.createElement('video')
   
    var then = 0
   
    function render(now) {
        now *= 0.001;
        const deltaTime = now - then
        then = now
       
        if (copyVideo) {
            updateTexture(gl, textures.background, videoStream)
        }
        if (copyCamera) {
            updateTexture(gl, currentFrame, cameraStream)
            if (! gotInitialFrame) {
                updateTexture(gl, initialFrame, cameraStream)
                gotInitialFrame = true
            }
            var textureSizeLocation = gl.getUniformLocation(shaderProgram, 'u_textureSize')
            var track = cameraStream.srcObject.getVideoTracks()[0].getSettings()

            gl.uniform2f(textureSizeLocation, track.width, track.height)
        }
    
        drawScene(gl, programInfo, buffers, textures, deltaTime)
       
        requestAnimationFrame(render)
    }
   
    requestAnimationFrame(render)

    navigator.mediaDevices.getUserMedia({video: {facingMode: 'user'}}).then(function(stream) {
        //video = document.getElementById('video')
        cameraStream.srcObject = stream
        cameraStream.onloadedmetadata = function(e) {
            cameraStream.play()
            copyCamera = true
        }
    }).catch(function(err){
        log.append(err)
    })

    restart.addEventListener('click', function(event) {
        gotInitialFrame = false
    })

    fullscreen.addEventListener('click', function(event) {
        var node = document.getElementById('app')
        if (node.requestFullscreen) {
            node.requestFullscreen()
        } else if (node.webkitRequestFullScreen) {
            node.webkitRequestFullScreen()
        }
    })

    function stopCamera() {
        cameraStream.srcObject.getTracks().forEach(function(track, index, all) {
            track.stop()
        })        
    }

    stop.addEventListener('click', stopCamera)

    changeCamera.addEventListener('click', function(event) {
        facing = !facing
        stopCamera()
        navigator.mediaDevices.getUserMedia({video: {facingMode: facing ? 'user' : 'environment'}}).then(function(stream) {
            //video = document.getElementById('video')
            cameraStream.srcObject = stream
            cameraStream.onloadedmetadata = function(e) {
                cameraStream.play()
                copyCamera = true
            }
        }).catch(function(err){
            log.append(err)
        })
        gotInitialFrame = false
    })

    changeBackgroundButton.addEventListener('click', changeBackground)
    initialiseControls()
}

// will set to true when video can be copied to texture
var copyVideo = false;
var copyCamera = false;
var gotInitialFrame = false;

function setupVideo(url) {
    const video = document.createElement('video');

    var playing = false;
    var timeupdate = false;

    video.autoplay = true;
    video.muted = true;
    video.loop = true;

    // Waiting for these 2 events ensures
    // there is data in the video

    video.addEventListener('playing', function() {
        playing = true;
        checkReady();
    }, true);

    video.addEventListener('timeupdate', function() {
        timeupdate = true;
        checkReady();
    }, true);

    video.src = url;
    video.play();

    function checkReady() {
        if (playing && timeupdate) {
            copyVideo = true;
        }
    }

    return video;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 255, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function initTexture(gl) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because video has to be download over the internet
    // they might take a moment until it's ready so
    // put a single pixel in the texture so we can
    // use it immediately.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);

    // Turn off mips and set  wrapping to clamp to edge so it
    // will work regardless of the dimensions of the video.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    return texture;
}

function updateTexture(gl, texture, video) {
    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, video);
}

/**
*
*/
var width = 130
var height = 130
 
function initBuffers(gl) {
    const positionBuffer = gl.createBuffer()   
    const textureCoordBuffer = gl.createBuffer()
    var positions = []
    var textureCoordinates = []

    positions.push(-1, -1, 0)
    textureCoordinates.push(0, 1)
    positions.push(1, -1, 0)
    textureCoordinates.push(1, 1)
    positions.push(1, 1, 0)
    textureCoordinates.push(1, 0)
    positions.push(-1, 1, 0)
    textureCoordinates.push(0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
       
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    var indices = []
    
    indices.push(0)
    indices.push(1)
    indices.push(2)

    indices.push(3)
    indices.push(2)
    indices.push(0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer
    }
}
 
var angle = 0
/**
*
*
*/
function drawScene(gl, programInfo, buffers, texture, deltaTime) {
    gl.canvas.width = gl.canvas.clientWidth
    gl.canvas.height = gl.canvas.clientHeight
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
   
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    angle += deltaTime * 15
                  
    {
        const numComponents = 3
        const type = gl.FLOAT
        const normalise = false
        const stride = 0
        const offset = 0
       
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalise,
            stride,
            offset)
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
    }
    {
        const num = 2; // every coordinate composed of 2 values
        const type = gl.FLOAT; // the data in the buffer is 32 bit float
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set to the next
        const offset = 0; // how many butes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }
    function computeKernelWeight(kernel) {
        var weight = kernel.reduce(function(prev, curr) {
            return prev + curr;
        });
        return weight <= 0 ? 1 : weight;
    }
    var transform = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]
    if (facing) {
        transform[0] = -1
    }
    gl.uniformMatrix4fv(programInfo.uniformLocation.transform,
        false,
        transform)

    var threshold = document.getElementById('threshold').value
    gl.uniform1f(programInfo.uniformLocation.threshold, threshold);
    gl.uniform1fv(programInfo.uniformLocation.kernel, kernel);
    gl.uniform1f(programInfo.uniformLocation.kernelWeight, weight);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.useProgram(programInfo.program)
   // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.currentFrame);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture.initialFrame);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture.background);
    // Bind the texture to texture unit 0

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocation.currentFrame, 0);
    gl.uniform1i(programInfo.uniformLocation.initialFrame, 1);
    gl.uniform1i(programInfo.uniformLocation.background, 2);
                       
    gl.uniform1f(programInfo.uniformLocation.delta, angle / 5)                   
    {
        const offset = 0
        const vertexCount = 6
 
        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, offset)
    }
}
       
function initialiseShaders(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
    const shaderProgram = gl.createProgram()
   
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
   
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to link the shader program: ' + gl.getProgramInfoLog(shaderProgram))
        return
    }
   
    return shaderProgram
}
 
/**
*
*/
function loadShader(gl, type, source) {
    const shader = gl.createShader(type)
   
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
   
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occured compiling ' + type + ': ' + gl.getShaderInfoLog(shader))
        return
    }
    return shader   
}