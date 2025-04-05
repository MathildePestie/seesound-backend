const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Vérifier que le dossier "uploads/" existe
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration pour stocker les fichiers sur le disque
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Enregistrer dans le dossier "uploads/"
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Générer un nom unique
  },
});

// Configuration Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "video/webm", "video/mp4"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non autorisé"));
    }
  },
  limits: { fileSize: 200 * 1024 * 1024 },
});

module.exports = upload;