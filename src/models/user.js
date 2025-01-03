const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: Number,
      min: 1000000000,
      max: 9999999999,
    },
    gender: {
      type: String,
      lowercase: true,
      validator: function (v) {
        if (!["male", "female", "others"].includes(v)) {
          throw new Error("Invalid Gender");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      required: true,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
