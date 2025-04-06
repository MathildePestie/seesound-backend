const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();
console.log("🔐 private_key starts with:", serviceAccount.private_key.slice(0, 30));
console.log("📦 Bucket utilisé :", bucket.name);
console.log("🔥 Config Firebase :");
console.log("project_id:", process.env.FIREBASE_PROJECT_ID);
console.log("client_email:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("private_key starts with:", process.env.FIREBASE_PRIVATE_KEY?.slice(0, 30));

const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});
console.log("🔍 Buckets disponibles :");
storage.getBuckets().then(res => console.log(res[0].map(b => b.name)));


module.exports = bucket;