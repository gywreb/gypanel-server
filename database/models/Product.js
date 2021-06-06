const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
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
    instock: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { id: false, toJSON: { virtuals: true }, timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema, "products");
