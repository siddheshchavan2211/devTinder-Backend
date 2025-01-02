const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
