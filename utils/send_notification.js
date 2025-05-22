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
    console.log("Successfully sent message:", response);
    res.status(200).send("Notification sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error sending notification");
  }
};

module.exports = { sendFCMNotification };
