// backend/config/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "seesound-d884f.firebasestorage.app",
});
console.log("📦 Bucket utilisé :", bucket.name);

const bucket = admin.storage().bucket();