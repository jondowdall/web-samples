var quaternion = {
    create: function(axis, angle) {
        var sinCoeff = Math.sin(angle * 0.5)
        return [Math.cos(angle * 0.5), sinCoeff * axis[0], sinCoeff * axis[1], sinCoeff * axis[2]];
    },
    getTransform: function(q) {
        return [
            (q[0] * q[0]) + (q[1] * q[1]) - (q[2] * q[2]) - (q[3] * q[3]),
            (2.0 * q[1] * q[2]) + (2.0 * q[0] * q[3]),
            (2.0 * q[1] * q[3]) - (2.0 * q[0] * q[2]),
            0.0,
               
            (2.0 * q[1] * q[2]) - (2.0 * q[0] * q[3]),
            (q[0] * q[0]) - (q[1] * q[1]) + (q[2] * q[2]) - (q[3] * q[3]),
            (2.0 * q[2] * q[3]) + (2.0 * q[0] * q[1]),
            0.0,
               
            (2.0 * q[1] * q[3]) + (2.0 * q[0] * q[2]),
            (2.0 * q[2] * q[3]) - (2.0 * q[0] * q[1]),
            (q[0] * q[0]) - (q[1] * q[1]) - (q[2] * q[2]) - (q[3] * q[3]),
            0.0,
               
            0.0,
            0.0,
            0.0,
            (q[0] * q[0]) + (q[1] * q[1]) + (q[2] * q[2]) + (q[3] * q[3])
        ]
    }
}
 
var mat4 = {
    create: function() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    },
    perspective: function(matrix,
                         fieldOfView,
                         aspect,
                         zNear,
                         zFar) {
        var f = 1.0 / Math.tan(fieldOfView / 2.0)
        matrix[0] = f / aspect
        matrix[1] = 0
        matrix[2] = 0
        matrix[3] = 0
        matrix[4] = 0
        matrix[5] = f
        matrix[6] = 0
        matrix[7] = 0
        matrix[8] = 0
        matrix[9] = 0
        matrix[10] = (zFar + zNear) / (zNear - zFar)
        matrix[11] = -1.0
        matrix[12] = 0
        matrix[13] = 0
        matrix[14] = (2.0 * zFar * zNear) / (zNear - zFar)
        matrix[15] = 1.0
    },
    translate: function (input, output, change) {
        var m = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            change[0], change[1], change[2], 1]
        this.multiply(input, m, output)
    },
    copy: function(input, output) {
        output[0] = input[0]
        output[1] = input[1]
        output[2] = input[2]
        output[3] = input[3]
        output[4] = input[4]
        output[5] = input[5]
        output[6] = input[6]
        output[7] = input[7]
        output[8] = input[8]
        output[9] = input[9]
        output[10] = input[10]
        output[11] = input[11]
        output[12] = input[12]
        output[13] = input[13]
        output[14] = input[14]
        output[15] = input[15]
    },
    rotate2d: function(input, output, angleInRadians) {
        var c = Math.cos(angleInRadians)
        var s = Math.sin(angleInRadians)
        var m = [
            c, -s, 0, 0,
            s,  c, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1
        ]
        var t = this.create()
        this.multiply(input, m, t)
        this.copy(t, output)
    },
    rotate: function(input, output, axis, angleInRadians) {
        var t = this.create()
        var q = quaternion.create(axis, angleInRadians)
        this.multiply(input, quaternion.getTransform(q), t)
        this.copy(t, output)
    },
    multiply: function(a, b, out) {
        out[ 0] = a[ 0] * b[ 0] + a[ 1] * b[ 4] + a[ 2] * b[ 8] + a[ 3] * b[12]
        out[ 1] = a[ 0] * b[ 1] + a[ 1] * b[ 5] + a[ 2] * b[ 9] + a[ 3] * b[13]
        out[ 2] = a[ 0] * b[ 2] + a[ 1] * b[ 6] + a[ 2] * b[10] + a[ 3] * b[14]
        out[ 3] = a[ 0] * b[ 3] + a[ 1] * b[ 7] + a[ 2] * b[11] + a[ 3] * b[15]
 
        out[ 4] = a[ 4] * b[ 0] + a[ 5] * b[ 4] + a[ 6] * b[ 8] + a[ 7] * b[12]
        out[ 5] = a[ 4] * b[ 1] + a[ 5] * b[ 5] + a[ 6] * b[ 9] + a[ 7] * b[13]
        out[ 6] = a[ 4] * b[ 2] + a[ 5] * b[ 6] + a[ 6] * b[10] + a[ 7] * b[14]
        out[ 7] = a[ 4] * b[ 3] + a[ 5] * b[ 7] + a[ 6] * b[11] + a[ 7] * b[15]
 
        out[ 8] = a[ 8] * b[ 0] + a[ 9] * b[ 4] + a[10] * b[ 8] + a[11] * b[12]
        out[ 9] = a[ 8] * b[ 1] + a[ 9] * b[ 5] + a[10] * b[ 9] + a[11] * b[13]
        out[10] = a[ 8] * b[ 2] + a[ 9] * b[ 6] + a[10] * b[10] + a[11] * b[14]
        out[11] = a[ 8] * b[ 3] + a[ 9] * b[ 7] + a[10] * b[11] + a[11] * b[15]
 
        out[12] = a[12] * b[ 0] + a[13] * b[ 4] + a[14] * b[ 8] + a[15] * b[12]
        out[13] = a[12] * b[ 1] + a[13] * b[ 5] + a[14] * b[ 9] + a[15] * b[13]
        out[14] = a[12] * b[ 2] + a[13] * b[ 6] + a[14] * b[10] + a[15] * b[14]
        out[15] = a[12] * b[ 3] + a[13] * b[ 7] + a[14] * b[11] + a[15] * b[15]
    },
    transpose: function(input, output) {
        var temp = this.create()
        this.copy(input, temp)
        output[1] = temp[4]
        output[2] = temp[8]
        output[3] = temp[12]
        output[4] = temp[2]
        output[6] = temp[9]
        output[7] = temp[13]
        output[8] = temp[2]
        output[9] = temp[6]
        output[11] = temp[14]
        output[12] = temp[3]
        output[13] = temp[7]
        output[14] = temp[11]
    },
    invert: function(input, output) {
        var x0 = input[0];
        var x1 = input[4];
        var x2 = input[8];
        var x3 = input[12];
        var x4 = input[1];
        var x5 = input[5];
        var x6 = input[9];
        var x7 = input[13];
        var x8 = input[2];
        var x9 = input[6];
        var x10 = input[10];
        var x11 = input[14];
        var x12 = input[3];
        var x13 = input[7];
        var x14 = input[11];
        var x15 = input[15];
        var a0 = x0 * x5 - x1 * x4;
        var a1 = x0 * x6 - x2 * x4;
        var a2 = x0 * x7 - x3 * x4;
        var a3 = x1 * x6 - x2 * x5;
        var a4 = x1 * x7 - x3 * x5;
        var a5 = x2 * x7 - x3 * x6;
        var b0 = x8 * x13 - x9 * x12;
        var b1 = x8 * x14 - x10 * x12;
        var b2 = x8 * x15 - x11 * x12;
        var b3 = x9 * x14 - x10 * x13;
        var b4 = x9 * x15 - x11 * x13;
        var b5 = x10 * x15 - x11 * x14;
        var invdet = 1 / (a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0);
        output[0] = (+x5 * b5 - x6 * b4 + x7 * b3) * invdet;
        output[4] = (-x1 * b5 + x2 * b4 - x3 * b3) * invdet;
        output[8] = (+x13 * a5 - x14 * a4 + x15 * a3) * invdet;
        output[12] = (-x9 * a5 + x10 * a4 - x11 * a3) * invdet;
        output[1] = (-x4 * b5 + x6 * b2 - x7 * b1) * invdet;
        output[5] = (+x0 * b5 - x2 * b2 + x3 * b1) * invdet;
        output[9] = (-x12 * a5 + x14 * a2 - x15 * a1) * invdet;
        output[13] = (+x8 * a5 - x10 * a2 + x11 * a1) * invdet;
        output[2] = (+x4 * b4 - x5 * b2 + x7 * b0) * invdet;
        output[6] = (-x0 * b4 + x1 * b2 - x3 * b0) * invdet;
        output[10] = (+x12 * a4 - x13 * a2 + x15 * a0) * invdet;
        output[14] = (-x8 * a4 + x9 * a2 - x11 * a0) * invdet;
        output[3] = (-x4 * b3 + x5 * b1 - x6 * b0) * invdet;
        output[7] = (+x0 * b3 - x1 * b1 + x2 * b0) * invdet;
        output[11] = (-x12 * a3 + x13 * a1 - x14 * a0) * invdet;
        output[15] = (+x8 * a3 - x9 * a1 + x10 * a0) * invdet;
        return this;
    }
}
       
/**
*
*/
function initialise() {
    var canvas = document.getElementById('main-canvas')
   
    canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
   
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
   
    if (!gl) {
        alert('Unable to get WebGL context')
        return
    }
   
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
 
    const vsSource =
       `#define PI 3.1415926538

        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;
        attribute vec4 aVertexColour;
       
        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform float uDelta;
       
        varying highp vec4 vColor;
        varying highp vec3 vLighting;
        varying highp vec2 vTextureCoord;
       
        void main() {
            float d = sqrt(aVertexPosition.x * aVertexPosition.x + aVertexPosition.z * aVertexPosition.z);
            float ax = aVertexPosition.x / d;
            float az = aVertexPosition.z / d;
            d = 1.0 / (2.0 * d * d + 1.0);
            gl_Position = aVertexPosition;
            gl_Position.y = gl_Position.y + 0.3 * sin(uDelta + 20.0 * d) * d;
            gl_Position = uProjectionMatrix * uModelViewMatrix * gl_Position;
            vColor = vec4(1.0, 1.0, 1.0, 1.0);/*aVertexColour*/;
 
            highp vec3 normal = aVertexNormal;
       
            highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            highp vec3 directionalLightColor = vec3(0.9, 0.9, 0.9);
            highp vec3 directionalVector = normalize(vec3(0.5, 0.8, 0.75));
            
            normal.x = ax * sin(uDelta + 20.0 * d);
            normal.y = normal.y * cos(uDelta + 10.0 * d);
            normal.z = az * sin(uDelta + 20.0 * d);
 
            highp vec4 transformedNormal = uNormalMatrix * vec4(normal, 1.0);
 
            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
            vTextureCoord = aTextureCoord;
       
        }`
       
    const fsSource =
       `varying highp vec2 vTextureCoord;
        varying highp vec4 vColor;
        varying highp vec3 vLighting;
        uniform sampler2D uSampler;

        void main() {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        }`
       
    const shaderProgram = initialiseShaders(gl, vsSource, fsSource)
   
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            vertexColour: gl.getAttribLocation(shaderProgram, 'aVertexColour')
        },
        uniformLocation: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            delta: gl.getUniformLocation(shaderProgram, 'uDelta')
        }
    }

    const buffers = initBuffers(gl)
    // Load texture
  const texture = initTexture(gl)

  const video = setupVideo('Firefox.mp4')
   
    var then = 0
   
    function render(now) {
        now *= 0.001;
        const deltaTime = now - then
        then = now
       
        if (copyVideo) {
            updateTexture(gl, texture, video);
        }
    
        drawScene(gl, programInfo, buffers, texture, deltaTime)
       
        requestAnimationFrame(render)
    }
   
    requestAnimationFrame(render)   
}

// will set to true when video can be copied to texture
var copyVideo = false;

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
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
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

function initTexture(gl, url) {
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
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                srcFormat, srcType, video);
}

/**
*
*/
var width = 170
var height = 170
 
function initBuffers(gl) {
    const positionBuffer = gl.createBuffer()   
    const normalBuffer = gl.createBuffer()   
    const colourBuffer = gl.createBuffer()
    const textureCoordBuffer = gl.createBuffer()
    var positions = []
    var normals = []
    var textureCoordinates = []
    var colours = []
    for (var i = 0; i <= width; ++i) {
        for (var j = 0; j <= height; ++j) {
            var x = (2 * i / width) - 1.0
            var z = (2 * j / height) - 1.0
            positions.push(2 * x, 0, 2 * z)
            normals.push(0, 1, 0)
            textureCoordinates.push(i / width, j / height)
            colours.push((x + 1) / 2, (1 - x) / 2, 1.0, 1.0)
        }
    }
 
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
       
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
       
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW)
 
    const indexBuffer = gl.createBuffer()
    var indices = []
    for (var tri = 0; tri < width * height; ++tri) {
        x = tri % width
        y = Math.floor(tri / width)
       
        indices.push(x + y * (width + 1))
        indices.push(x + 1 + y * (width + 1))
        indices.push(x + (y + 1) * (width + 1))
 
        indices.push(x + 1 + y * (width + 1))
        indices.push(x + (y + 1) * (width + 1))
        indices.push(x + 1 + (y + 1) * (width + 1))
    }
 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    return {
        position: positionBuffer,
        normal: normalBuffer,
        textureCoord: textureCoordBuffer,
        colour: colourBuffer,
        indices: indexBuffer
    }
}
 
var angle = 0
/**
*
*
*/
function drawScene(gl, programInfo, buffers, texture, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
   
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
   
    const fieldOfView = 45 * Math.PI / 180
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
    const zNear = 1.0
    const zFar = 100.0
    const projectionMatrix = mat4.create()
   
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar)
                    
    const modelViewMatrix = mat4.create()
   
    angle += deltaTime * 15
 
    mat4.rotate(modelViewMatrix,
                modelViewMatrix,
                [1.4142135623730950488016887242097, 1.4142135623730950488016887242097, 0],
                angle * Math.PI / 180)
 
    mat4.translate(modelViewMatrix,
                   modelViewMatrix,
                   [0.0, 0.0, -6.0])
                  
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
        const numComponents = 3
        const type = gl.FLOAT
        const normalise = false
        const stride = 0
        const offset = 0
       
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalise,
            stride,
            offset)
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal)
    }
    /*{
        const numComponents = 4
        const type = gl.FLOAT
        const normalise = false
        const stride = 0
        const offset = 0
       
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colour)
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColour,
            numComponents,
            type,
            normalise,
            stride,
            offset)
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColour)
    }*/
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
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.useProgram(programInfo.program)
   // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocation.uSampler, 0);
 
    const normalMatrix = mat4.create()
    mat4.invert(modelViewMatrix, normalMatrix)
    mat4.transpose(normalMatrix, normalMatrix)
   
    gl.uniformMatrix4fv(programInfo.uniformLocation.projectionMatrix,
                        false,
                        projectionMatrix)
       
    gl.uniformMatrix4fv(programInfo.uniformLocation.normalMatrix,
                        false,
                        normalMatrix)
 
    gl.uniformMatrix4fv(programInfo.uniformLocation.modelViewMatrix,
                        false,
                        modelViewMatrix)
                       
    gl.uniform1f(programInfo.uniformLocation.delta, angle / 5)                   
    {
        const offset = 0
        const vertexCount = width * height * 6
 
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