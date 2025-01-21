const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
      validate(v) {
        if (!validator.isEmail(v)) {
          throw new Error("Invalid Email" + v);
        }
      },
    },
    password: {
      type: String,
      validate(v) {
        if (!validator.isStrongPassword(v)) {
          throw new Error("Password is not strong enough" + v);
        }
      },
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
      validate(v) {
        if (!validator.isURL(v)) {
          throw new Error("Invalid Photo Url");
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      required: true,
      default: "This is a sample about",
    },
  },
  {
    timestamps: true,
  },
  { strictPopulate: false }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Morya@22112001", {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (userpassword) {
  const user = this;
  const dbpassword = user.password;
  const decryptpass = await bcrypt.compare(userpassword, dbpassword);
  return decryptpass;
};

module.exports = mongoose.model("User", userSchema);
