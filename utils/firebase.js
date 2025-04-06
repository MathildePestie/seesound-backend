const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
});

const bucket = admin.storage().bucket();
console.log("📦 Bucket utilisé :", bucket.name);
console.log("🔥 Config Firebase :");
console.log("project_id:", process.env.FIREBASE_PROJECT_ID);
console.log("client_email:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("private_key starts with:", process.env.FIREBASE_PRIVATE_KEY?.slice(0, 30));


module.exports = bucket;