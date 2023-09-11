function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const buffer = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }

  return buffer;
}

navigator.serviceWorker.register("service-worker.js");

navigator.serviceWorker.ready
  .then(async function (registration) {
    // Use the PushManager to get the user's subscription to the push service.
    const subscription = await registration.pushManager.getSubscription();
    // If a subscription was found, return it.
    if (subscription) {
      return subscription;
    }

    const vapidPublicKey =
      "BFiGN-1ixongQ4YVFGJP-lvnjs8Jpmfo8IzPtXOA_mVpx5xBjZvGLoL_TSALkai3dlh2zZNgAOHZoYfC0Ktad54";
    // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
    // You need to implement urlBase64ToUint8Array() function
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
  })
  .then(function (subscription) {
    fetch("http://localhost:5555/register", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: subscription,
      }),
    });

    document.getElementById("doIt").onclick = function () {
      const payload = document.getElementById("notification-payload").value;
      const delay = document.getElementById("notification-delay").value;
      const ttl = document.getElementById("notification-ttl").value;

      // Ask the server to send the client a notification (for testing purposes, in actual
      // applications, the push notification is likely going to be generated by some event
      // in the server).
      fetch("http://localhost:5555/sendNotification", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription,
          payload: payload,
          delay: delay,
          ttl: ttl,
        }),
      });
    };
  });