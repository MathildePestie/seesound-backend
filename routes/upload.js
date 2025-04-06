const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/users");
const { capitalizeFirstLetter } = require("../utils/format");
const bucket = require("../utils/firebase");


router.post(
  "/save-visual",
  upload.fields([{ name: "audio" }, { name: "video" }]),
  async (req, res) => {
    try {
      console.log("🎧 Fichiers reçus :", req.files);
      console.log("📨 Corps reçu :", req.body);
      const { title, artist, date_of_creation } = req.body;
      const token = req.headers.authorization?.split(" ")[1];
      console.log("📦 Token reçu :", token);

      if (!token) {
        return res.status(401).json({ error: "Token manquant ou invalide" });
      }

      const user = await User.findOne({ token });
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non autorisé" });
      }

      console.log("🧪 req.files:", req.files);
      if (!req.files || !req.files.video || !req.files.video[0]) {
        return res.status(400).json({ error: "Fichier vidéo manquant" });
      }

      const videoFilePath = req.files.video[0].path;
      const videoFilename = req.files.video[0].filename;

      if (!req.files || !req.files.video || !req.files.video[0]) {
        return res.status(400).json({ error: "Fichier vidéo manquant" });
      }

      console.log("📂 Chemin de la vidéo :", videoFilePath);
      await bucket.upload(videoFilePath, {
        destination: `videos/${videoFilename}`,
        public: true,
        metadata: { contentType: "video/mp4" },
      });

      const publicVideoUrl = `https://storage.googleapis.com/${bucket.name}/videos/${videoFilename}`;

      const newMusic = {
        title: capitalizeFirstLetter(title),
        artist: capitalizeFirstLetter(artist),
        date_of_creation: new Date(date_of_creation),
        mp4Url: publicVideoUrl,
        username: user.username,
      };

      console.log(
        "Suppression du fichier vidéo à l'emplacement :",
        videoFilePath
      );
      fs.unlinkSync(videoFilePath);
      console.log("Ajout de la musique à l'utilisateur :", newMusic);

      user.music.push(newMusic);
      await user.save();

      res.json({
        message: "Visualisation sauvegardée avec succès",
        mp4Url: publicVideoUrl,
      });
    } catch (error) {
      console.error("❌ Erreur:", error.message);
      console.error("❌ Stack:", error.stack);
      res
        .status(500)
        .json({ error: "Erreur serveur lors de l'enregistrement" });
    }
  }
);

router.get("/my-visuals", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ error: "Token manquant ou invalide" });

    const user = await User.findOne({ token });
    if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });

    res.json({ visuals: user.music });
  } catch (error) {
    console.error("Erreur lors de la récupération des visualisations :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/like-visual", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { videoUrl } = req.body;

    if (!token || !videoUrl) {
      return res.status(400).json({ error: "Token ou vidéo manquant" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non autorisé" });
    }

    // Rechercher l'utilisateur contenant la musique avec cette vidéo
    const userWithMusic = await User.findOne({ "music.mp4Url": videoUrl });
    if (!userWithMusic) {
      return res.status(404).json({ error: "Musique non trouvée" });
    }

    // Trouver l'œuvre spécifique
    const musicItem = userWithMusic.music.find((m) => m.mp4Url === videoUrl);
    if (!musicItem) {
      return res.status(404).json({ error: "Visualisation non trouvée" });
    }

    const alreadyLiked = musicItem.likes.includes(token);

    if (alreadyLiked) {
      // Supprimer le like
      musicItem.likes = musicItem.likes.filter((t) => t !== token);
    } else {
      // Ajouter le like
      musicItem.likes.push(token);
    }

    await userWithMusic.save();
    res.json({
      message: alreadyLiked ? "Like retiré" : "Like ajouté",
      totalLikes: musicItem.likes.length,
    });
  } catch (error) {
    console.error("Erreur lors du like:", error);
    res.status(500).json({ error: "Erreur serveur lors du like" });
  }
});

router.get("/all-visuals", async (req, res) => {
  try {
    // On récupère tous les utilisateurs
    const allUsers = await User.find();

    // On extrait toutes les musiques dans un seul tableau
    const allVisuals = allUsers.flatMap((user) => {
      return user.music.map((m) => ({
        ...m.toObject(),
        username: user.username, // on ajoute l'auteur
      }));
    });

    res.json({ visuals: allVisuals.reverse() }); // reverse pour la plus récente d'abord
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de toutes les visualisations :",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/delete-visual", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("🔍 Requête DELETE reçue avec body :", req.body);
    const { videoUrl } = req.body;

    if (!token || !videoUrl) {
      return res.status(400).json({ error: "Token ou URL manquants" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non autorisé" });
    }

    // Récupération du nom de fichier depuis l'URL Firebase
    const match = videoUrl.match(/videos%2F(.+?)\?/);
    const filename = match ? match[1] : null;

    if (filename) {
      const file = bucket.file(`videos/${filename}`);
      await file
        .delete()
        .then(() => {
          console.log(`✅ Vidéo supprimée du bucket : videos/${filename}`);
        })
        .catch((err) => {
          console.warn(
            "⚠️ Impossible de supprimer la vidéo du bucket :",
            err.message
          );
        });
    } else {
      console.warn("⚠️ Aucun nom de fichier trouvé dans l'URL :", videoUrl);
    }

    // Suppression de la vidéo dans la base utilisateur
    user.music = user.music.filter((m) => m.mp4Url !== videoUrl);
    await user.save();

    res.json({ message: "Visualisation supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression" });
  }
});

module.exports = router;
