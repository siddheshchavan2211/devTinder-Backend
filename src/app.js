const express = require("express");
const app = express();

app.use((req, res) => {
  res.send("hello jiiii.....");
});
app.listen(1000, () => {
  console.log("server start");
});
