const admin = require("firebase-admin");
// Initialize Firebase Admin SDK
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const sendFCMNotification = async ({ title, body, data, token }) => {
  const message = {
    notification: {
      title: title || "Test Notification",
      body: body || "This is a test notification from your server!",
  
    },
    data: data || {}, // Optional custom data
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.log(error)
    return error;
  }
};

module.exports = { sendFCMNotification };
