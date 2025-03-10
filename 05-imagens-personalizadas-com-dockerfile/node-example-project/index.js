const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const message = process.env.MESSAGE || "Hello World!";

app.get("/", (req, res) => {
  res.send(message);
});
console.log("File Changed")
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
