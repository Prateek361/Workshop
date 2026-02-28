/***********************************************************
  TEACHABLE MACHINE MODEL (GITHUB DEPLOYMENT SAFE VERSION)
************************************************************/

let model, webcam, labelContainer, maxPredictions;

// Main function (make sure button calls THIS name)
async function initScanner() {

    // Prevent running on pages without webcam container
    const container = document.getElementById("webcam-container");
    if (!container) return;

    try {

        // IMPORTANT: relative path for GitHub
        const URL = "./model/";

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Load model
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Setup webcam
        const flip = true;
        webcam = new tmImage.Webcam(350, 350, flip);

        await webcam.setup();   // Ask permission
        await webcam.play();

        window.requestAnimationFrame(loop);

        container.innerHTML = ""; // clear previous canvas
        container.appendChild(webcam.canvas);

        labelContainer = document.getElementById("prediction");

    } catch (error) {
        console.error("Initialization Error:", error);
        alert("Error loading model or webcam. Check console.");
    }
}

// Continuous loop
async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// Prediction function
async function predict() {

    const prediction = await model.predict(webcam.canvas);

    let highest = prediction[0];

    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > highest.probability) {
            highest = prediction[i];
        }
    }

    const confidence = (highest.probability * 100).toFixed(2);

    if (labelContainer) {
        labelContainer.innerHTML = `
            <h2>${highest.className}</h2>
            <p>Confidence: ${confidence}%</p>
        `;
    }
}
