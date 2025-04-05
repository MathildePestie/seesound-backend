const express = require('express');
const router = express.Router();
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const { capitalizeFirstLetter } = require('../utils/format');

router.post('/signup', async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  if (!username || !password || !firstname || !lastname) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Utilisateur déjà existant' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    token: uid2(32),
    username, // ← pas de capitalisation ici volontairement
    lastname: capitalizeFirstLetter(lastname),
    firstname: capitalizeFirstLetter(firstname),
    password: hashedPassword,
    music: [],
  });

  await newUser.save();
  res.json({ message: 'Utilisateur créé avec succès !', token: newUser.token });
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }); // pareil ici
  if (!user) {
    return res.status(400).json({ error: 'Utilisateur introuvable' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }

  res.json({ message: 'Connexion réussie', token: user.token });
});

module.exports = router;