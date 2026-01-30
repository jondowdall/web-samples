function main(event) {
    for (const node of document.querySelectorAll('.piece')) {
        node.draggable = true;
        node.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData("text/plain", "This text may be dragged"),
            event.preventDefault();
        });
    }
}

// Example: Basic Setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;

console.log(window.navigator.mediaDevices);
window.navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    // Use requestAnimationFrame to analyze data
  });


const canvas = document.getElementById('main');
const context = canvas.createContext('2d');

function update(time) {
    const width = canvas.width;
    const height = canvas.height;


    // Inside analysis loop:
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyser.getFloatFrequencyData(dataArray);
    // dataArray now contains decibel values for frequencies

    const binWidth = width / analyser.frequencyBinCount;

    for (let bin = 0; bin < analyser.frequencyBinCount; ++bin) {
        const y = dataArray[bin] * height;
        context.fillStyle = `hsl(${dataArray[bin]} 80% 80%)`;
        context.fillRect(bin * binWidth, height - y, binWidth, y);
    }

    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
