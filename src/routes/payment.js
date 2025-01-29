const express = require("express");
const paymentRouter = express.Router();
const instance = require("../utils/razorpay");
const { UserAuthorization } = require("../middleware/Authorization");
const ordermodel = require("../models/order");
const { subscriptionType } = require("../utils/validation");
const User = require("../models/user");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
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

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhooksign = req.headers("X-Razorpay-Signature");
    const isValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhooksign,
      process.env.WEBHOOK_PASS
    );
    if (!isValid) {
      return res.status(400).json({ message: "Invalid Signature" });
    }
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await ordermodel.findOne({ orderId: paymentDetails._id });
    payment.status = paymentDetails.status;
    await payment.save();

    const updateUser = await User.findOne({ _id: payment.userId });
    updateUser.subscriptionStatus = true;
    updateUser.subscriptionType = payment.notes.membershipType;
    await updateUser.save();
    // if (req.body.event === "payment.captured") {
    // }
    // if (req.body.event === "payment.failed") {
    // }
    return res.status(200).json({ message: "Webhook Recieved" });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = paymentRouter;
