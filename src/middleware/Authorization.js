// impport jwt and user model then create a function destructure the cookies and verify the jwt.token verify(token,secret)
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const UserAuthorization = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decode = await jwt.verify(token, "Morya@22112001");
    const { _id } = decode;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Invalid User");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR" + error.message);
  }
};

module.exports = { UserAuthorization };
