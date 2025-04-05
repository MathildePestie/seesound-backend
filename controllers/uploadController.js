const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const generateVisualizerFrames = require("../utils/visualizer");

const tempDir = path.join(__dirname, "../temp");
const outputDir = path.join(__dirname, "../uploads");

// Vérifie et crée les dossiers si nécessaires
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
const { saveAudioToFile } = require("../utils/ffmpegHelper"); // Assure-toi d'avoir bien configuré cette fonction

const processAudio = async (audioPath) => {
  try {
    const outputDir = "uploads/frames"; // Chemin où tu veux enregistrer les images générées
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Générer les frames à partir du fichier audio
    await generateVisualizerFrames(audioPath, outputDir);

    // Convertir les frames en vidéo (ici, à compléter avec FFmpeg ou une autre méthode)
    const videoPath = audioPath.replace(".mp3", "-video.mp4");
    await saveAudioToFile(audioPath, videoPath);

    return videoPath; // Retourner le chemin de la vidéo générée
  } catch (error) {
    console.error("Erreur de traitement de l'audio :", error);
    throw error;
  }
};

module.exports = { processAudio };