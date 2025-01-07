const validator = require("validator");
const User = require("../models/user");
const updateProfileValidation = (req) => {
  //makearray andd then check on body
  const userData = req.body;
  const allowedEditData = [
    "firstName",
    "lastName",
    "mobile",
    "gender",
    "age",
    "photoUrl",
    "skills",
    "about",
  ];
  //   for(let i=0;i<allowedEditData.length;i++){
  //     if(!userData[allowedEditData[i]]){
  //       throw new Error("Invalid Data");
  //     }
  //   }
  const isEditAllowed = Object.keys(userData).every((key) =>
    allowedEditData.includes(key)
  );
  return isEditAllowed;
};
const passwordChangedValidation = (req) => {
  const { password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not strong enough");
    }
  } else {
    throw new Error("Passwords do not match");
  }
};

module.exports = {
  updateProfileValidation,
  passwordChangedValidation,
};
