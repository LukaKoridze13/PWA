document.addEventListener("DOMContentLoaded", () => {
  const subscribeButton = document.getElementById("subscribe");
  const sendNotificationButton = document.getElementById("sendNotification");

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(
      "service-worker.js",
      { scope: "/" }
    );
  }

  subscribeButton.addEventListener("click", () => {
    subscribeToPushNotifications();
  });

  sendNotificationButton.addEventListener("click", () => {
    sendNotification();
  });
});

async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BOFWDAaOvqQ1cBTxg_IwQ1cRNJ5Z3QouAiIgzo4JRJXdw_CnlrSPJRxaeiIlfH23-VERIKuhKzJXi49ERjykQ3E"
      ),
    });

    await fetch("https://pwa13-0b157be66bae.herokuapp.com/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    alert("Subscribed to push notifications!");
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
  }
}

async function sendNotification() {
  const message = "This is a test push notification message.";

  try {
    const response = await fetch(
      "https://pwa13-0b157be66bae.herokuapp.com/send-notification",
      {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      alert("Push notification sent successfully!");
    } else {
      alert("Failed to send push notification.");
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

// Helper function to convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
