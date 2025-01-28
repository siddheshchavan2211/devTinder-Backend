const express = require("express");
const paymentRouter = express.Router();
const instance = require("../utils/razorpay");
const { UserAuthorization } = require("../middleware/Authorization");
const ordermodel = require("../models/order");
const { subscriptionType } = require("../utils/validation");
paymentRouter.post("/payment/create", UserAuthorization, async (req, res) => {
  const { firstName, lastName, email } = req.user;
  const { membershipType } = req.body;
  const amount = subscriptionType[membershipType] * 100;

  try {
    const order = await instance.orders.create({
      amount,
      currency: "INR",
      receipt: "Receipt No. #1",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: membershipType,
      },
    });

    const orderDoc = new ordermodel({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      notes: order.notes,
    });

    const paymentsaved = await orderDoc.save();
    res.json({ ...paymentsaved.toJSON() });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
    console.log(err);
  }
});
module.exports = paymentRouter;
