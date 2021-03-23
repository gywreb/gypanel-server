const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceSchema = new Schema(
  {
    fromStaff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
    clientInfo: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    total: {
      type: Number,
      required: [true, "total is required"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
  },
  { id: false, toJSON: { virtuals: true }, timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema, "invoices");
