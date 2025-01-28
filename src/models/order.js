const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "PENDING",
    },
    notes: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        min: 1000000000,
        max: 9999999999,
      },
      membershipType: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("order", orderSchema);
