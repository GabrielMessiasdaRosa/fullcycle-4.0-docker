const mongooose = require("mongoose");

const DEFAULT_PORT = 8080;

mongooose.connect("mongodb://db:27017/test");

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
