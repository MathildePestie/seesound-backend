const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

const WIDTH = 1920;
const HEIGHT = 1080;
const FRAMES = 60;

async function generateVisualizerFrames(audioPath, outputDir) {
  console.log("🎵 Analyse audio et génération des images...");

  for (let i = 0; i < FRAMES; i++) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = `hsl(${i * 6}, 100%, 50%)`;
    ctx.lineWidth = 4;
    ctx.beginPath();

    for (let x = 0; x < WIDTH; x++) {
      const y = HEIGHT / 2 + Math.sin(x * 0.02 + i * 0.1) * 100;
      ctx.lineTo(x, y);
    }

    ctx.stroke();

    const framePath = path.join(
      outputDir,
      `frame-${i.toString().padStart(4, "0")}.png`
    );
    console.log(`🖼️ Création de ${framePath}`);
    fs.writeFileSync(framePath, canvas.toBuffer("image/png"));
    console.log(`✅ Frame sauvegardée : ${framePath}`);
  }

  console.log("✅ Frames générées avec succès !");
}

module.exports = generateVisualizerFrames;
