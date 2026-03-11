const canvas = document.getElementById('main');
const context = canvas.getContext('2d');
context.width = canvas.width = canvas.clientWidth;
context.height = canvas.height = canvas.clientHeight;

const waterfall = document.getElementById('waterfall');
const waterfallContext = waterfall.getContext('2d');
waterfallContext.width = waterfall.width = canvas.clientWidth;
waterfallContext.height = waterfall.height = canvas.clientHeight;

const app = {
    notes: [],
    info: { maxFrequency: 0 },
    history: [],
    index: 0,
    max: 0,
    bufferSize: 512,
    i: 0,
    window: 3,
    threshold: 110,
};


/**
 * Chrome required that the audio context is created in the context of a user event.
 * @param {user event} event 
 */
function start(event) {
    // Basic Setup
    app.audioContext = new AudioContext();
    app.analyser = app.audioContext.createAnalyser();
    app.analyser.minDecibels = -90;
    app.analyser.maxDecibels = -10;
    app.analyser.fftSize = 4096; // Sets frequency resolution


    if (event.shiftKey) {
        // 2. Load audio file (simplified)
        fetch('music.mp3')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => app.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                // 3. Play sound
                const source = app.audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(app.analyser);
                app.analyser.connect(app.audioContext.destination);
                drawSpectrum();
                source.start();
            });
    } else {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                //const source = audioContext.createMediaStreamSource(stream);
                const source = new MediaStreamAudioSourceNode(app.audioContext, {
                    mediaStream: stream,
                });
                source.connect(app.analyser);
                app.analyser.connect(app.audioContext.destination);
                drawSpectrum(); // Call to animation function
            });
    }

    // Data Extraction
    app.bufferLength = app.analyser.frequencyBinCount;
    // .dataArray = new Float32Array(app.bufferLength);
    app.dataArray = new Uint8Array(app.bufferLength);
    app.timeDomainArray = new Float32Array(app.bufferLength);
}

/**
 * @brief Return the centre frequency of a bin in the spectrum.
 * 
 * @param {int} index frequency bin to convert to frequency
 * @returns {number} frequency in Hz of the center of the bin
 */
function getFrequency(index) {
    const nyquist = app.audioContext.sampleRate / 2;
    const frequency = (index * nyquist) / app.bufferLength;
    return frequency;
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const frequencies = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88,];


/**
 * 
 * @param {number} frequency frequency to convert to note
 * @returns {object} Midi note number, note name as string, octave.
 */
function getNote(frequency) {
    const number = (12 * Math.log2(frequency / 440)) + 69;

    const name = notes[Math.ceil(number - 24) % 12];
    const octave = 1 + Math.floor((number - 24) / 12);

    return { number, name, octave, str: `${name}${octave}` };
}


/**
 * Convert a note to a frequency
 */
function frequency(note) {
    note = note.toUpperCase().replace(/H/, 'B');
    const match = note.match(/(?<note>[A-G]#?)(?<octave>[0-9]*)/);
    if (match) {
        const index = notes.indexOf(match.groups.note);
        const octave = parseInt(match.groups.octave) || 4;
        return frequencies[index] * Math.pow(2, octave - 4);
    }
}

const max = { index: 0, value: 0 };
let last;
let currentNotes = [];
const sequence = [];

function drawSpectrum() {
    if (!app.paused) {
        requestAnimationFrame(drawSpectrum);
    }
    const now = performance.now();

    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const binWidth = width / app.analyser.frequencyBinCount;

    app.analyser.getFloatTimeDomainData(app.timeDomainArray);

    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(0, height / 2);
    for (let bin = 0; bin < app.analyser.frequencyBinCount; ++bin) {
        const y = height * (1 + app.timeDomainArray[bin]) * 0.5;
        context.lineTo(bin * binWidth, y);
    }
    context.stroke();

    //app.analyser.getFloatFrequencyData(app.dataArray);
    app.analyser.getByteFrequencyData(app.dataArray);
    // ... Code to draw dataArray on canvas
    const overlay = document.getElementById('overlay');

    max.value *= 0.9;
    let total = 0;

    // Check current notes
    currentNotes = currentNotes.filter((note) => {
        if (app.dataArray[note.index] < note.level * 0.9) {
            note.end = now;
            sequence.push(note);
            return false;
        }
        return true;
    });

    let n1 = 0;
    let n2 = 0;

    app.dataArray.forEach((val, i) => {
        if (i < 1024 && n1 > app.threshold && n1 > n2 && n1 > val && !currentNotes.find((note) => note.index === i)) {
            const frequency = getFrequency(i - 1);
            const note = getNote(frequency);
            note.frequency = frequency;
            note.index = i;
            note.start = now;
            note.level = n1;
            currentNotes.push(note);
        }
        n2 = n1;
        n1 = val;
        if (val > max.value) {
            max.value = val;
            max.index = i;
        }
        total += val;
    });

    if (total > app.max) {
        app.max = total;
    }

    const fps = 1000 / (now - last);
    last = now;

    if (overlay) {
        const frequency = getFrequency(max.index);
        const note = getNote(frequency);
        overlay.innerHTML = `${frequency.toFixed(2)} Hz, ${Math.round(note.number)}, ${note.name}${note.octave}, ${max.value.toFixed(2)}, ${fps.toFixed(1)} fps ${currentNotes.length}`;
        app.notes.push({ frequency, note });
        if (frequency > app.info.maxFrequency) {
            app.info.maxFrequency = frequency;
        }
    }

    app.history.push(total);

    if (app.history.length > app.bufferSize) {
        app.history.shift();
        app.notes.shift();
    }

    {
        const divisor = 3;
        const y = app.i * height / app.bufferSize;
        for (let bin = 0; bin < app.analyser.frequencyBinCount / divisor; ++bin) {
            const x = width * bin / app.analyser.frequencyBinCount * divisor;
            waterfallContext.fillStyle = `hsl(${app.dataArray[bin] * 360 / 255} 80% 80%)`;
            waterfallContext.fillRect(x, y, divisor * width / app.analyser.frequencyBinCount, height / app.bufferSize);
        }
        app.i = (app.i + 1) % app.bufferSize;
        const y1 = app.i * height / app.bufferSize;

        context.drawImage(waterfall, 0, 0, width, y1, 0, height - y1, width, y1);
        context.drawImage(waterfall, 0, y1, width, height - y1, 0, 0, width, height - y1);
    }

    for (let bin = 0; bin < app.analyser.frequencyBinCount; ++bin) {
        const y = app.dataArray[bin] * height / 255;
        context.fillStyle = `hsl(${app.dataArray[bin]} 80% 80%)`;
        context.fillRect(bin * binWidth, height - y, binWidth, y);
    }

    context.fillStyle = `rgb(200 200 200 0.7)`;
    context.fillRect(max.index * binWidth, 0, binWidth, height);

    context.fillStyle = `hsl(${app.dataArray[max.index]} 80% 80%)`;
    context.fillRect(max.index * binWidth, height - max.value, binWidth, max.value);
    
    context.strokeStyle = 'red';
    context.beginPath();
    context.moveTo(0, (1 - app.history[0] / app.max) * height);
    app.history.forEach((item, i) =>
        context.lineTo(width * i / app.history.length, (1 - item / app.max) * height));
    context.stroke();
    
    /*
    const y = app.dataArray[max.index] * height / 255;
    context.strokeStyle = 'green';
    context.beginPath();
    context.moveTo(0, (1 - app.notes[0].frequency / app.info.maxFrequency) * height);
    app.notes.forEach((note, i) =>
        context.lineTo(width * i / app.notes.length, (1 - note.frequency / app.info.maxFrequency) * height));
    context.stroke();

    let lastNote;
    context.fillStyle = 'black';
    context.font = "bold 12px sans-serif";
    app.notes.forEach((note, i) => {
        const number = Math.round(note.note.number);
        if (i === 0 || number !== lastNote) {
            //            context.fillText(note.note.str, width * i / app.notes.length, (1 - note.frequency / app.info.maxFrequency) * height);
            context.fillText(note.note.str, note.frequency / app.info.maxFrequency * width, height * (1 - i / app.notes.length));
        }
        lastNote = number;
    });
    */

    context.textAlign = 'center';
    context.textBaseline = 'top';

    currentNotes.forEach((note) => {
        context.fillStyle = `rgb(150, 255, 150, ${note.level / 255})`;
        const x = width * note.index / 128;
        const top = height * (1 - (now - note.start) / (app.window * 1000));
        context.fillRect(x, top, width / 128, height - top);

        context.fillStyle = 'black';
        context.fillText(note.str, x + width / 256, Math.max(0, top));
    });

    for (let i = sequence.length - 1; i > 0 && (now - sequence[i].end) < (app.window * 1000); --i) {
        const note = sequence[i];
        context.fillStyle = `rgb(150, 255, 150, ${note.level / 255})`;
        const x = width * note.index / 128;
        const top = height * (1 - (now - note.start) / (app.window * 1000));
        const barHeight = height * (note.end - note.start) / (app.window * 1000);

        context.fillRect(x, top, width / 128, barHeight);

        context.fillStyle = 'black';
        context.fillText(note.str, x + width / 256, Math.max(0, top));
    }
}

const startButton = document.getElementById('start');
startButton.addEventListener('click', (event) => {
    start(event);
    startButton.remove();
});

const pause = document.getElementById('pause');
pause.addEventListener('click', (event) => {
    app.paused = !app.paused;
    if (!app.paused) {
        drawSpectrum();
    }
});

const reset = document.getElementById('reset');
reset.addEventListener('click', (event) => {
    app.maxFrequency = 0;
    app.max = 0;
});