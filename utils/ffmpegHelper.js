const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const saveAudioToFile = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(inputPath)) {
      console.error("❌ Le fichier d'entrée n'existe pas :", inputPath);
      return reject(new Error('Fichier audio introuvable'));
    }

    // Vérifier si le fichier de sortie existe déjà
    if (fs.existsSync(outputPath)) {
      console.warn("⚠️ Le fichier de sortie existe déjà, il sera écrasé :", outputPath);
      fs.unlinkSync(outputPath); // Supprime l'ancien fichier
    }

    ffmpeg(inputPath)
      .audioCodec('aac')
      .toFormat('m4a') // Assurer un format correct
      .on('start', (cmd) => console.log("🚀 Commande FFmpeg lancée :", cmd))
      .on('end', () => {
        console.log("✅ Conversion terminée :", outputPath);
        resolve(outputPath);
      })
      .on('stderr', (stderrLine) => console.log("📝 FFmpeg stderr :", stderrLine))
      .on('error', (err) => {
        console.error("❌ Erreur FFmpeg :", err);
        reject(err);
      })
      .save(outputPath);
  });
};

module.exports = { saveAudioToFile };