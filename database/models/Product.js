const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    description: String,
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    featuredImg: {
      type: String,
      required: [true, "featured image is required"],
    },
    images: [{ type: String }],
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { id: false, toJSON: { virtuals: true }, timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema, "products");
