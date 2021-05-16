const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceSchema = new Schema(
  {
    fromStaff: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    clientInfo: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "customerId is required"],
    },
    productList: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
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
    isConfirm: {
      type: Boolean,
      default: false,
    },
  },
  { id: false, toJSON: { virtuals: true }, timestamps: true }
);

InvoiceSchema.path("productList").validate(function (productList) {
  if (!productList.length || productList) return false;
}, "Invoice needs to have at least one product");

module.exports = mongoose.model("Invoice", InvoiceSchema, "invoices");
