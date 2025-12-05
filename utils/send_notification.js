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
    android: {
      priority: "high",
      notification: {
        channelId: "high_importance_channel",
        defaultSound: true,
        defaultVibrateTimings: true,
        visibility: "public",
        priority: "max",
      },
    },
    apns: {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          sound: "default",
          badge: 1, // If you want to show at least one badge when app is not opened
          alert: {
            title: title || "Test Notification",
            body: body || "This is a test notification from your server!",
          },
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { sendFCMNotification };
