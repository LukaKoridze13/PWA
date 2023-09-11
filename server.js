import express from "express";
import webPush from "web-push";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5555;

app.use(express.json());
app.use(cors());

const vapidPublicKey =
  "BFiGN-1ixongQ4YVFGJP-lvnjs8Jpmfo8IzPtXOA_mVpx5xBjZvGLoL_TSALkai3dlh2zZNgAOHZoYfC0Ktad54";
const vapidPrivateKey = "amUunF4xa8bpKBPBRPeCJJRmGJ_9e8ql8BJYJ1K4yPs";

webPush.setVapidDetails(
  "mailto:lukakoridze13@gmail.com", // Use the correct URL here
  vapidPublicKey,
  vapidPrivateKey
);

app.get("/vapidPublicKey", (req, res) => {
  res.send(vapidPublicKey);
});

app.post("/register", (req, res) => {
  // A real-world application would store the subscription info.
  res.sendStatus(201);
});

app.post("/sendNotification", (req, res) => {
  const subscription = req.body.subscription;
  const payload = JSON.stringify(req.body.payload);
  const options = {
    TTL: req.body.ttl,
  };

  setTimeout(() => {
    webPush
      .sendNotification(subscription, payload, options)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(500);
      });
  }, req.body.delay * 1000);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
