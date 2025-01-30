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
const crypto = require("crypto");

paymentRouter.post("/payment/create", UserAuthorization, async (req, res) => {
  const { firstName, lastName, email } = req.user;
  const { membershipType } = req.body;
  const amount = subscriptionType[membershipType] * 100;

  try {
    const order = await instance.orders.create({
      amount,
      currency: "INR",
      receipt: crypto.randomUUID(),
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

paymentRouter.post("/subscription/webhook", async (req, res) => {
  try {
    console.log("Webhook Recieved");
    const webhooksign = req.get("X-Razorpay-Signature");
    console.log(webhooksign + "sign");
    const isValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhooksign,
      process.env.WEBHOOK_PASS
    );
    if (!isValid) {
      return res.status(400).json({ message: "Invalid Signature" });
    }
    console.log(isValid + "isValid");
    const paymentDetails = req.body.payload.payment.entity;
    console.log("Payment Details:", JSON.stringify(paymentDetails, null, 2));

    const payment = await ordermodel.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log(payment.status + "payment.status");

    const updateUser = await User.findOne({ _id: payment.userId });
    updateUser.subscriptionStatus = true;
    updateUser.subscriptionType = payment.notes.membershipType;

    await updateUser.save();
    console.log(updateUser);
    return res.status(200).json({ message: "Webhook Recieved" });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

paymentRouter.get(
  "/subscription/verify",
  UserAuthorization,
  async (req, res) => {
    const user = req.user;
    if (user.subscriptionStatus) {
      return res.status(200).json({ subscriptionStatus: true });
    } else {
      return res.status(200).json({ subscriptionStatus: false });
    }
  }
);
module.exports = paymentRouter;
