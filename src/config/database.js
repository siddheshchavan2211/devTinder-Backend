const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(
    "mongodb+srv://sidkc1205:Morya%40123@siddemo.sfiqv.mongodb.net/devloperTinder"
  );
}
module.exports = main;
