const mongooose = require("mongoose");

const mongoURL = process.env.MONGO_URL;
const DEFAULT_PORT = 8080;

if (!mongoURL) {
  throw new Error("MONGO_URL is required");
}

mongooose.connect(mongoURL);

const db = mongooose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connected to MongoDB on Docker");
});

const app = require("express")();

app.listen(DEFAULT_PORT, () => {
  console.log(`Server listening on port ${DEFAULT_PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello Docker!");
});
