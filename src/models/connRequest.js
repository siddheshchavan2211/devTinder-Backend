const mongoose = require("mongoose");
const { Schema } = mongoose;

const connRequest = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Intersted", "Ignored", "Accepted", "Rejected"],
        message: `{VALUE} is a incorrect status`,
      },
    },
  },
  {
    timestamps: true,
  }
);
connRequest.index({ senderId: 1, recieverId: 1 }, { unique: true });
const ConnReqModel = new mongoose.model("ConnRequest", connRequest);
module.exports = ConnReqModel;
