const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceSchema = new Schema(
  {
    fromStaff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "staff is required"],
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
        name: {
          type: String,
          required: [true, "product name is required"],
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "product price is required"],
          min: [100, "price must be at least 100"],
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
    confirmDate: {
      type: Date,
      default: null,
    },
  },
  { id: false, toJSON: { virtuals: true }, timestamps: true }
);

InvoiceSchema.path("productList").validate(function (productList) {
  if (!productList.length || !productList) return false;
}, "Invoice needs to have at least one product");

module.exports = mongoose.model("Invoice", InvoiceSchema, "invoices");
