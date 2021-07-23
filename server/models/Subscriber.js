const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//video table 생성
//db Vo 같은성격??

const SubscriberSchema = mongoose.Schema(
  {
    UserTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    UserForm: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);

module.exports = { Subscriber };
