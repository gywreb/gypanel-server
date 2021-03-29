const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: [3, "name must be at least 3 characters"],
    trim: true,
  },
  description: String,
});

module.exports = mongoose.model("Category", CategorySchema, "categories");
