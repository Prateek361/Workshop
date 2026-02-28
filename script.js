/***********************************************************
  TEACHABLE MACHINE MODEL (LOCAL DOWNLOADED VERSION)
************************************************************/

let model, webcam, labelContainer, maxPredictions;

async function initScanner() {

    if (!document.getElementById("webcam-container")) return;

    // 👇 Local model folder
    const URL = "model/";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load model from local files
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = true;
    webcam = new tmImage.Webcam(350, 350, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("prediction");
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {

    const prediction = await model.predict(webcam.canvas);

    let highest = prediction[0];

    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > highest.probability) {
            highest = prediction[i];
        }
    }

    const confidence = (highest.probability * 100).toFixed(2);

    labelContainer.innerHTML = `
        <h2>${highest.className}</h2>
        <p>Confidence: ${confidence}%</p>
    `;
}

window.addEventListener("load", () => {
    initScanner();
});